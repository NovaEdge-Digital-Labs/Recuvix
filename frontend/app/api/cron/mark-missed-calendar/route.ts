import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');

    // Vercel Cron sets Authorization: Bearer {CRON_SECRET}
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabaseAdmin.rpc('mark_missed_calendar_events' as any);

        if (error) {
            console.error('RPC Error (mark_missed_calendar_events):', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Missed calendar events updated successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Cron Execution Error (mark-missed-calendar):', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
