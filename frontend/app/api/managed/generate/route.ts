import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { buildBlogPrompt } from '@/lib/prompts/promptBuilder'
import { decryptKey } from '@/lib/managed/keyEncryption'
import { forwardLLMStream } from '@/lib/managed/streamForwarder'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/utils/rateLimiter'

const generateSchema = z.object({
    topic: z.string(),
    country: z.string(),
    tone: z.string(),
    wordCount: z.number(),
    outputFormat: z.string(),
    preferredProvider: z.enum(['claude', 'openai', 'gemini', 'grok']),
    approvedOutline: z.any().optional(),
    authorDetails: z.any().optional(),
    includeAiImages: z.boolean().optional().default(false),
    includeStockImages: z.boolean().optional().default(false),
    includeThumbnail: z.boolean().optional().default(false),
    workspaceId: z.string().uuid().optional(),
})

async function getPlatformSetting(key: string) {
    const { data } = await (supabaseAdmin
        .from('platform_settings') as any)
        .select('value')
        .eq('key', key)
        .single()
    return data?.value
}

export async function POST(req: NextRequest) {
    const startTime = Date.now()
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    // Rate limit: 10 generations per hour per user
    if (!checkRateLimit(user.id, 'managed_generate', 10, 3600000)) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. You can generate up to 10 blogs per hour in managed mode.' }), { status: 429 })
    }

    try {
        const body = await req.json()
        const validatedData = generateSchema.safeParse(body)
        if (!validatedData.success) {
            return new Response(JSON.stringify({ error: 'Invalid request data', details: validatedData.error }), { status: 400 })
        }

        const {
            topic, country, tone, wordCount, outputFormat,
            preferredProvider, approvedOutline, authorDetails, workspaceId
        } = validatedData.data

        // 1. Check managed mode and balance
        let hasCredits = false;
        let currentBalance = 0;

        if (workspaceId) {
            const { data: workspace } = await (supabaseAdmin
                .from('workspaces') as any)
                .select('credits_balance')
                .eq('id', workspaceId)
                .single();

            currentBalance = workspace?.credits_balance || 0;
            hasCredits = currentBalance >= 1;

            // Verify membership
            const { data: membership } = await (supabaseAdmin
                .from('workspace_members') as any)
                .select('role')
                .eq('workspace_id', workspaceId)
                .eq('user_id', user.id)
                .single();

            if (!membership) {
                return new Response(JSON.stringify({ error: 'not_a_workspace_member' }), { status: 403 });
            }
        } else {
            const { data: profile } = await (supabaseAdmin
                .from('profiles') as any)
                .select('credits_balance, managed_mode_enabled')
                .eq('id', user.id)
                .single();

            if (!profile?.managed_mode_enabled) {
                return new Response(JSON.stringify({ error: 'managed_mode_not_enabled' }), { status: 403 });
            }

            currentBalance = profile.credits_balance || 0;
            hasCredits = currentBalance >= 1;
        }

        if (!hasCredits) {
            return new Response(JSON.stringify({
                error: 'insufficient_credits',
                balance: currentBalance,
                redirectTo: workspaceId ? `/workspace/${workspaceId}/credits` : '/pricing'
            }), { status: 402 })
        }

        // 2. Select platform key with fallback
        const fallbackOrder = (await getPlatformSetting('fallback_order') as string[]) || ['claude', 'openai', 'gemini', 'grok']
        const providerOrder = [
            preferredProvider,
            ...fallbackOrder.filter(p => p !== preferredProvider)
        ]

        let selectedKey = null
        let selectedProvider = null

        for (const provider of providerOrder) {
            const { data } = await (supabaseAdmin.rpc as any)('select_platform_key', { p_provider: provider })
            if (data && data.length > 0) {
                selectedKey = data[0]
                selectedProvider = provider
                break
            }
        }

        if (!selectedKey) {
            return new Response(JSON.stringify({
                error: 'no_keys_available',
                message: 'Managed generation is temporarily unavailable. Please try BYOK mode or try again later.'
            }), { status: 503 })
        }

        const decryptedKey = decryptKey(selectedKey.encrypted_key)

        // 3. Pre-deduct credit
        let deductResult: any;
        if (workspaceId) {
            const { data } = await (supabaseAdmin.rpc as any)('deduct_workspace_credit', {
                p_workspace_id: workspaceId,
                p_user_id: user.id,
                p_blog_topic: topic,
            });
            deductResult = data;
        } else {
            const { data } = await (supabaseAdmin.rpc as any)('deduct_credit', {
                p_user_id: user.id,
                p_blog_id: null,
                p_blog_topic: topic,
                p_llm_provider: selectedProvider,
            });
            deductResult = data;
        }

        if (!deductResult?.success) {
            return new Response(JSON.stringify({
                error: 'credit_deduction_failed',
                balance: deductResult?.balance || deductResult?.balance_after
            }), { status: 402 })
        }

        // 4. Create blog record
        const { data: blog, error: blogError } = await (supabaseAdmin
            .from('blogs') as any)
            .insert({
                user_id: user.id,
                workspace_id: workspaceId,
                approval_status: workspaceId ? 'pending' : 'approved',
                generated_by: user.id,
                title: topic,
                topic,
                country,
                format: outputFormat,
                model: selectedProvider,
                language_code: 'en',
                generation_input: body,
            })
            .select()
            .single()

        if (blogError) throw blogError

        // 5. Setup SSE response
        const encoder = new TextEncoder()
        const stream = new TransformStream()
        const writer = stream.writable.getWriter()

        const sendEvent = async (data: object) => {
            await writer.write(encoder.encode('data: ' + JSON.stringify(data) + '\n\n'))
        }

            // Run generation in "background" while returning response
            ; (async () => {
                let totalTokens = 0
                let success = false
                let errorCode: string | null = null
                let blogHtml = ''

                try {
                    await sendEvent({ type: 'step', step: 1, message: 'Preparing your blog...' })

                    const prompt = buildBlogPrompt({
                        topic, country, tone, wordCount,
                        approvedOutline,
                        authorDetails
                    } as any)

                    await sendEvent({ type: 'step', step: 2, message: 'Writing your blog...' })

                    const forwardResult = await forwardLLMStream(
                        selectedProvider!,
                        decryptedKey,
                        selectedKey.model,
                        prompt,
                        writer,
                        req.signal
                    )

                    blogHtml = forwardResult.blogHtml
                    totalTokens = forwardResult.tokenCount
                    success = forwardResult.success
                    errorCode = forwardResult.errorCode

                    if (success) {
                        await sendEvent({ type: 'step', step: 3, message: 'Processing your blog...' })
                        // In a real implementation, we would call processImagesInMarkdown, generateSeoMeta, etc. here
                        // For now, we'll keep it simple as a proof of concept

                        await sendEvent({
                            type: 'done',
                            blogId: blog.id,
                            blogHtml,
                            blogMarkdown: blogHtml, // Simple mapping for now
                            creditsRemaining: (deductResult as any).balance_after,
                        })

                        // Update blog record
                        await (supabaseAdmin
                            .from('blogs') as any)
                            .update({
                                blog_html: blogHtml,
                                blog_markdown: blogHtml,
                                word_count: blogHtml.split(/\s+/).length,
                            })
                            .eq('id', blog.id)

                        // Link calendar entry if provided
                        if (body.calendarEntryId) {
                            await (supabaseAdmin
                                .from('calendar_entries') as any)
                                .update({
                                    status: 'published',
                                    blog_id: blog.id,
                                    published_url: `/results?id=${blog.id}`
                                })
                                .eq('id', body.calendarEntryId)
                        }

                        // Update credit transaction
                        await (supabaseAdmin
                            .from('credit_transactions') as any)
                            .update({ blog_id: blog.id })
                            .eq('user_id', user.id)
                            .eq('type', 'usage')
                            .order('created_at', { ascending: false })
                            .limit(1)

                    } else {
                        throw new Error(`LLM Error: ${errorCode}`)
                    }

                } catch (error: any) {
                    console.error('Generation failure:', error)
                    errorCode = errorCode || error.code || 'unknown'

                    // Refund credit
                    await (supabaseAdmin.rpc as any)('add_credits', {
                        p_user_id: user.id,
                        p_amount: 1,
                        p_razorpay_payment_id: null,
                        p_razorpay_order_id: null,
                        p_razorpay_signature: null,
                        p_pack_id: 'refund',
                        p_pack_name: 'Generation failure refund',
                        p_amount_paid_inr: 0,
                    })

                    await sendEvent({
                        type: 'error',
                        error: error.message,
                        errorCode,
                        creditRefunded: true,
                    })
                } finally {
                    // Record usage
                    await (supabaseAdmin
                        .from('platform_key_usage_log') as any)
                        .insert({
                            key_id: selectedKey.key_id,
                            user_id: user.id,
                            blog_id: blog?.id,
                            provider: selectedProvider,
                            model: selectedKey.model,
                            status: success ? 'success' : errorCode === '429' ? 'rate_limited' : 'failed',
                            total_tokens: totalTokens,
                            completed_at: new Date().toISOString(),
                            duration_ms: Date.now() - startTime,
                            blog_topic: topic,
                            error_code: errorCode,
                            credit_refunded: !success,
                        })

                    await (supabaseAdmin.rpc as any)('record_key_usage', {
                        p_key_id: selectedKey.key_id,
                        p_status: success ? 'success' : errorCode === '429' ? 'rate_limited' : 'failed',
                        p_tokens: totalTokens,
                        p_error_code: errorCode,
                    })

                    await writer.close()
                }
            })()

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        })

    } catch (error: any) {
        console.error('Managed route error:', error)
        return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), { status: 500 })
    }
}
