import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'

const deductCreditSchema = z.object({
    userId: z.string().uuid(),
    blogId: z.string().uuid().optional(),
    blogTopic: z.string(),
    llmProvider: z.string(),
})

export async function POST(req: NextRequest) {
    try {
        const internalKey = req.headers.get('x-internal-key')

        if (!internalKey || internalKey !== process.env.INTERNAL_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = deductCreditSchema.safeParse(body)

        if (!validatedData.success) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        const { userId, blogId, blogTopic, llmProvider } = validatedData.data

        const { data: result, error: rpcError } = await (supabaseAdmin as any).rpc('deduct_credit', {
            p_user_id: userId,
            p_blog_id: blogId || null,
            p_blog_topic: blogTopic || 'Unknown',
            p_llm_provider: llmProvider || 'unknown'
        })

        if (rpcError || !(result as any).success) {
            console.error('Deduct credit RPC error:', rpcError)
            return NextResponse.json({
                error: (result as any)?.error || 'Credit deduction failed',
                balance: (result as any)?.balance
            }, { status: 402 })
        }

        return NextResponse.json({
            success: true,
            balance: (result as any).balance_after
        })
    } catch (error) {
        console.error('Internal deduct credit error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
