import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const { data, error } = await (supabaseAdmin
            .from('platform_api_keys') as any)
            .select('provider')
            .eq('is_active', true)
            .eq('is_healthy', true)
            .or('rate_limit_reset_at.is.null,rate_limit_reset_at.lt.now()')

        if (error) throw error

        const providers = {
            claude: false,
            openai: false,
            gemini: false,
            grok: false,
        }

        data?.forEach((key: any) => {
            if (key.provider in providers) {
                providers[key.provider as keyof typeof providers] = true
            }
        })

        const isAnyAvailable = Object.values(providers).some(v => v === true)

        return NextResponse.json({
            available: isAnyAvailable,
            providers,
            message: isAnyAvailable ? undefined : 'Managed generation is temporarily unavailable.'
        })
    } catch (error) {
        console.error('Availability check failed:', error)
        return NextResponse.json({
            available: false,
            providers: { claude: false, openai: false, gemini: false, grok: false },
            error: 'Failed to check availability'
        }, { status: 500 })
    }
}
