import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { CREDIT_PACKS, CreditPackId } from '@/lib/config/creditPacks'
import Razorpay from 'razorpay'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/utils/rateLimiter'
import { getIp } from '@/lib/utils/getIp'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const createOrderSchema = z.object({
    packId: z.enum(['starter', 'pro', 'agency', 'mega'] as [string, ...string[]]),
})

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Rate limit: 10 orders per hour per user
        if (!checkRateLimit(session.user.id, 'create_order', 10, 3600000)) {
            return NextResponse.json({ error: 'Too many payment attempts. Please wait before trying again.' }, { status: 429 })
        }

        const body = await req.json()
        const validatedData = createOrderSchema.safeParse(body)

        if (!validatedData.success) {
            return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 })
        }

        const { packId } = validatedData.data
        const pack = CREDIT_PACKS.find((p) => p.id === packId)

        if (!pack) {
            return NextResponse.json({ error: 'Pack not found' }, { status: 404 })
        }

        // Get user profile for prefill
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('full_name')
            .eq('id', session.user.id)
            .single()

        // Create Razorpay order
        const tenantHeader = req.headers.get('x-recuvix-tenant');
        const tenant = tenantHeader ? JSON.parse(tenantHeader) : null;
        const tenantId = tenant?.id || null;

        const order = await razorpay.orders.create({
            amount: pack.priceInPaise,
            currency: 'INR',
            receipt: 'recuvix_' + nanoid(10),
            notes: {
                user_id: session.user.id,
                pack_id: packId,
                pack_name: pack.name,
                credits: pack.credits,
                tenant_id: tenantId,
            },
        })

        // Save order to razorpay_orders table using admin client
        const { error: dbError } = await (supabaseAdmin.from('razorpay_orders' as any).insert({
            user_id: session.user.id,
            razorpay_order_id: order.id,
            pack_id: packId,
            pack_name: pack.name,
            credits: pack.credits,
            amount_inr: pack.priceInPaise,
            status: 'created',
            tenant_id: tenantId,
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        } as any) as any)

        if (dbError) {
            console.error('Error saving order to DB:', dbError)
            return NextResponse.json({ error: 'Failed to create order record' }, { status: 500 })
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            packName: pack.name,
            credits: pack.credits,
            prefill: {
                name: (profile as any)?.full_name || '',
                email: session.user.email || '',
            },
        })
    } catch (error) {
        console.error('Razorpay order creation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
