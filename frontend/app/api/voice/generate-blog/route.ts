import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { forwardLLMStream } from '@/lib/managed/streamForwarder';
import { z } from 'zod';
import { resolveLLMKey } from '@/lib/wl/tenantKeyResolver';

const generateSchema = z.object({
    recordingId: z.string().uuid(),
    llmProvider: z.enum(['claude', 'openai', 'gemini', 'grok', 'openrouter']),
    apiKey: z.string(),
    blogTitle: z.string(),
    focusKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).optional().default([]),
    country: z.string(),
    tone: z.string(),
    wordCount: z.number(),
    outputFormat: z.enum(['html', 'md', 'xml']),
    approvedOutline: z.any().optional(),
    authorDetails: z.any().optional(),
    preserveSpeakerVoice: z.boolean().optional().default(true),
    addSeoEnhancements: z.boolean().optional().default(true),
    includeQuotes: z.boolean().optional().default(true),
    workspaceId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // Fallback for manual token
            const token = req.headers.get('Authorization')?.split(' ')[1];
            if (token) {
                const { data: { user: fallbackUser }, error: fallbackError } = await supabaseAdmin.auth.getUser(token);
                if (!fallbackError && fallbackUser) {
                    return proceedWithGenerate(req, fallbackUser);
                }
            }
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        return proceedWithGenerate(req, user);
    } catch (error: any) {
        console.error('Generate Blog API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

async function proceedWithGenerate(req: NextRequest, user: any) {
    try {

        const tenantId = req.headers.get('x-recuvix-tenant');
        const body = await req.json();
        const validated = generateSchema.safeParse(body);
        if (!validated.success) {
            return new Response(JSON.stringify({ error: 'Invalid data', details: validated.error }), { status: 400 });
        }

        const {
            recordingId, llmProvider, apiKey: userApiKey, blogTitle,
            focusKeyword, secondaryKeywords, country,
            tone, wordCount, outputFormat, approvedOutline,
            authorDetails, preserveSpeakerVoice, addSeoEnhancements,
            includeQuotes, workspaceId
        } = validated.data;

        // Resolve the actual key to use (User BYOK > Tenant Key > Platform Key)
        const { key: resolvedKey, source: keySource } = await resolveLLMKey(
            llmProvider,
            tenantId,
            userApiKey
        );

        // 1. Get Recording
        const { data: recording, error: recError } = await (supabaseAdmin
            .from('voice_recordings') as any)
            .select('*')
            .eq('id', recordingId)
            .eq('user_id', user.id)
            .single();

        if (recError || !recording || !recording.transcript_cleaned) {
            return new Response(JSON.stringify({ error: 'Transcript missing or recording not found' }), { status: 400 });
        }

        const analysis = JSON.parse((recording.transcript_structured as string) || '{}');

        // 2. Build Voice-to-Blog Prompt
        const prompt = `
You are an expert content writer who transforms spoken audio transcripts into polished, SEO-optimized blog posts.

CRITICAL INSTRUCTION: This blog must be based PRIMARILY on the transcript content below. Do not invent facts, insights, or examples not present in the transcript. You are editing and structuring existing content, not creating new content.

BLOG SETTINGS:
Title: ${blogTitle}
Focus Keyword: ${focusKeyword}
Secondary Keywords: ${secondaryKeywords.join(', ')}
Country: ${country}
Target Tone: ${tone}
Target Word Count: approximately ${wordCount} words
Speaker Voice Style: ${analysis.speakerTone || 'Natural'}

TRANSCRIPT ANALYSIS:
Main Thesis: ${analysis.mainThesis}
Key Insights:
${analysis.keyInsights?.map((i: string, n: number) => `${n + 1}. ${i}`).join('\n')}

${includeQuotes && analysis.strongQuotes?.length > 0 ? `STRONG QUOTES (feature these as blockquotes):
${analysis.strongQuotes.map((q: string) => `"${q}"`).join('\n')}` : ''}

CLEANED TRANSCRIPT (your primary source):
${recording.transcript_cleaned.slice(0, 6000)}

${approvedOutline ? `APPROVED STRUCTURE (follow exactly):
H1: ${approvedOutline.h1}
H2 sections:
${approvedOutline.h2s?.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}` : ''}

WRITING INSTRUCTIONS:
1. USE THE TRANSCRIPT AS YOUR SOURCE: Every claim, example, and insight must come from the transcript.
2. STRUCTURE FOR SEO: Use the focus keyword in the H1 and first H2. Add a FAQ section if appropriate.
3. VOICE PRESERVATION: ${preserveSpeakerVoice ? "Preserve first-person 'I' and the speaker's natural style." : "Convert to neutral, professional third-person."}
4. ENHANCE WITH STRUCTURE: ${addSeoEnhancements ? "Add Engaging intro, transition sentences, and a strong conclusion." : "Keep it as close to the transcript as possible."}
5. NO EMOJIS.
6. IMAGE PLACEHOLDERS: Insert [BLOGIMAGE: alt text] at logical visual break points (every 2-3 H2s).

OUTPUT: Return ONLY clean HTML. Start with <style>. End with </article>.

BEGIN WRITING NOW.
`.trim();

        // 3. Setup SSE
        const encoder = new TextEncoder();
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        const sendEvent = async (data: object) => {
            await writer.write(encoder.encode('data: ' + JSON.stringify(data) + '\n\n'));
        };

        (async () => {
            try {
                await sendEvent({ type: 'step', step: 1, message: 'Preparing transcript...' });

                // Update recording status
                await (supabaseAdmin
                    .from('voice_recordings') as any)
                    .update({ generation_status: 'in_progress' })
                    .eq('id', recordingId);

                await sendEvent({ type: 'step', step: 2, message: 'Generating your blog...' });

                // Forward stream
                const forwardResult = await forwardLLMStream(
                    llmProvider,
                    resolvedKey,
                    llmProvider === 'openai' ? 'gpt-4o' :
                        llmProvider === 'claude' ? 'claude-3-5-sonnet-20240620' :
                            llmProvider === 'openrouter' ? 'openai/gpt-4o' :
                                llmProvider === 'grok' ? 'grok-2-latest' :
                                    'gemini-1.5-pro',
                    prompt,
                    writer,
                    req.signal
                );

                if (forwardResult.success) {
                    await sendEvent({ type: 'step', step: 3, message: 'Finalising...' });

                    // Create blog record (Simplified for now, normally would use blogsService)
                    const { data: blog } = await (supabaseAdmin
                        .from('blogs') as any)
                        .insert({
                            user_id: user.id,
                            workspace_id: workspaceId || null,
                            title: blogTitle,
                            topic: blogTitle,
                            blog_html: forwardResult.blogHtml,
                            status: 'published',
                            model: llmProvider,
                            word_count: forwardResult.blogHtml.split(/\s+/).length,
                            language_code: 'en',
                            tenant_id: tenantId
                        })
                        .select()
                        .single();

                    if (blog) {
                        await (supabaseAdmin
                            .from('voice_recordings') as any)
                            .update({
                                blog_id: (blog as any).id,
                                generation_status: 'complete'
                            })
                            .eq('id', recordingId);

                        await sendEvent({
                            type: 'done',
                            blogId: blog.id,
                            blogHtml: forwardResult.blogHtml,
                        });
                    }
                } else {
                    throw new Error(forwardResult.errorCode || 'Generation failed');
                }

            } catch (err: any) {
                console.error('SSE Error:', err);
                await (supabaseAdmin
                    .from('voice_recordings') as any)
                    .update({ generation_status: 'failed' })
                    .eq('id', recordingId);
                await sendEvent({ type: 'error', error: err.message });
            } finally {
                await writer.close();
            }
        })();

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error('Generate Blog API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
