import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch balance and managed mode status from profiles
        const { data: profile, error: profileError } = await (supabase
            .from('profiles') as any)
            .select('credits_balance, credits_total_purchased, credits_total_used, managed_mode_enabled')
            .eq('id', session.user.id)
            .single()

        if (profileError || !profile) {
            // If profile doesn't exist, return a default state instead of 404
            return NextResponse.json({
                balance: 0,
                totalPurchased: 0,
                totalUsed: 0,
                managedMode: false,
                history: [],
            })
        }

        // Fetch last 10 transactions
        const { data: transactions, error: txnError } = await (supabase
            .from('credit_transactions') as any)
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(10)

        if (txnError) {
            console.error('Error fetching transactions:', txnError)
        }

        return NextResponse.json({
            balance: (profile as any).credits_balance,
            totalPurchased: (profile as any).credits_total_purchased,
            totalUsed: (profile as any).credits_total_used,
            managedMode: (profile as any).managed_mode_enabled,
            history: transactions || [],
        })
    } catch (error) {
        console.error('Balance fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
