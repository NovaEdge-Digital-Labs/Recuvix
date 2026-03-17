import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { mode } = await req.json()

        if (mode !== 'managed' && mode !== 'byok') {
            return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
        }

        const { error } = await (supabaseAdmin
            .from('profiles') as any)
            .update({ managed_mode_enabled: mode === 'managed' })
            .eq('id', session.user.id)

        if (error) throw error

        return NextResponse.json({ success: true, mode })
    } catch (error: any) {
        console.error('Update mode error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
