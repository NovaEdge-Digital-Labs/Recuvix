import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'
import crypto from 'crypto'

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
})

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = verifyPaymentSchema.safeParse(body)

        if (!validatedData.success) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validatedData.data

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex')

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
        }

        // 1. Get order details
        const { data: order, error: orderError } = await (supabaseAdmin
            .from('razorpay_orders') as any)
            .select('*')
            .eq('razorpay_order_id', razorpay_order_id)
            .single()

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        if (order.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (order.status === 'paid') {
            return NextResponse.json({
                success: true,
                creditsAdded: 0,
                message: 'Payment already processed'
            })
        }

        // 3. Update order and add credits via RPC
        const { data: result, error: rpcError } = await (supabaseAdmin as any).rpc('add_credits', {
            p_user_id: order.user_id,
            p_amount: order.credits,
            p_razorpay_payment_id: razorpay_payment_id,
            p_razorpay_order_id: razorpay_order_id,
            p_razorpay_signature: razorpay_signature,
            p_pack_id: order.pack_id,
            p_pack_name: order.pack_name,
            p_amount_paid_inr: order.amount_inr,
        })

        if (rpcError) throw rpcError

        if ((result as any).error === 'duplicate_payment') {
            return NextResponse.json({
                success: true,
                message: 'Payment already processed',
                newBalance: (result as any).balance_after
            })
        }

        // 4. Record revenue if it's a tenant order
        if (order.tenant_id) {
            try {
                await (supabaseAdmin.from('wl_revenue_transactions' as any).insert({
                    tenant_id: order.tenant_id,
                    user_id: order.user_id,
                    amount_total: order.amount_inr / 100, // paise to INR
                    amount_partner_share: (order.amount_inr / 100) * 0.7, // Example 70% share
                    currency: 'INR',
                    transaction_type: 'credit_purchase',
                    status: 'completed',
                    metadata: {
                        razorpay_payment_id,
                        razorpay_order_id,
                        pack_name: order.pack_name
                    }
                } as any) as any);
            } catch (revError) {
                console.error('Error recording revenue transaction:', revError);
                // Don't fail the whole request if revenue recording fails
            }
        }

        return NextResponse.json({
            success: true,
            creditsAdded: (result as any).credits_added,
            newBalance: (result as any).balance_after,
            packName: (order as any).pack_name,
        })
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
