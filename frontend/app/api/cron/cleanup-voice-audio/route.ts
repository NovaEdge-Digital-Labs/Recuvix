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
        const { error } = await supabaseAdmin.rpc('cleanup_voice_audio_files' as any);

        if (error) {
            console.error('RPC Error (cleanup_voice_audio_files):', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Voice audio cleanup completed successfully',
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Cron Execution Error (cleanup-voice-audio):', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
