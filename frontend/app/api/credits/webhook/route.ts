import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text()
        const signature = req.headers.get('x-razorpay-signature')

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
        }

        // Verify webhook signature
        const expectedSig = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(rawBody)
            .digest('hex')

        if (expectedSig !== signature) {
            console.error('Invalid webhook signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const payload = JSON.parse(rawBody)

        // Handle payment.captured event
        if (payload.event === 'payment.captured') {
            const payment = payload.payload.payment.entity
            const razorpayOrderId = payment.order_id
            const razorpayPaymentId = payment.id
            const notes = payment.notes

            // Look up order in DB
            const { data: order } = await (supabaseAdmin
                .from('razorpay_orders') as any)
                .select('*')
                .eq('razorpay_order_id', razorpayOrderId)
                .single()

            if (!order) {
                console.error('Order not found for webhook:', razorpayOrderId)
                return NextResponse.json({ error: 'Order not found' }, { status: 404 })
            }

            if ((order as any).status === 'paid') {
                return NextResponse.json({ success: true, message: 'Already processed' })
            }

            // Add credits via RPC
            const { error: rpcError } = await (supabaseAdmin as any).rpc('add_credits', {
                p_user_id: (order as any).user_id,
                p_amount: (order as any).credits,
                p_razorpay_payment_id: razorpayPaymentId,
                p_razorpay_order_id: razorpayOrderId,
                p_razorpay_signature: 'WEBHOOK', // For webhook we use the webhook signature as verification
                p_pack_id: (order as any).pack_id,
                p_pack_name: (order as any).pack_name,
                p_amount_paid_inr: (order as any).amount_inr,
            })

            if (rpcError) {
                console.error('Webhook RPC Error:', rpcError)
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json({ received: true }) // Still return 200 to avoid retries on parsing errors
    }
}
