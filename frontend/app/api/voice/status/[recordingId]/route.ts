import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

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

        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            req.headers.get('Authorization')?.split(' ')[1] || ''
        );

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
