import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/voice/status/[recordingId]
 * Polls transcription status and returns transcript if complete.
 */

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ recordingId: string }> }
) {
    try {
        const { recordingId } = await params;
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // Fallback for manual token
            const token = req.headers.get('Authorization')?.split(' ')[1];
            if (token) {
                const { data: { user: fallbackUser }, error: fallbackError } = await supabaseAdmin.auth.getUser(token);
                if (!fallbackError && fallbackUser) {
                    return proceedWithStatus(recordingId, fallbackUser);
                }
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return proceedWithStatus(recordingId, user);
    } catch (error: any) {
        console.error('Status API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

async function proceedWithStatus(recordingId: string, user: any) {
    try {

        const { data: recording, error: dbError } = await (supabaseAdmin
            .from('voice_recordings') as any)
            .select('*')
            .eq('id', recordingId)
            .eq('user_id', user.id)
            .single();

        if (dbError || !recording) {
            return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
        }

        return NextResponse.json({
            status: recording.transcription_status,
            transcript: recording.transcript_raw,
            durationSeconds: recording.audio_duration_seconds,
            detectedLanguage: recording.audio_language,
            wordCount: recording.word_count_transcript,
            error: recording.transcription_error,
            segments: recording.whisper_segments,
        });

    } catch (error: any) {
        console.error('Status API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
