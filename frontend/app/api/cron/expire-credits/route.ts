import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');

    // Vercel Cron sets Authorization: Bearer {CRON_SECRET}
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { error } = await supabaseAdmin.rpc('handle_expired_credits');

        if (error) {
            console.error('RPC Error (handle_expired_credits):', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Expired credits processed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Cron Execution Error (expire-credits):', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
