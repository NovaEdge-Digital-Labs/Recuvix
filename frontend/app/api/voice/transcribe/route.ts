import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { chunkAudioFile, transcribeChunks } from '@/lib/voice/audioChunker';
import { checkRateLimit } from '@/lib/utils/rateLimiter';

/**
 * POST /api/voice/transcribe
 * Triggers Whisper transcription for an uploaded recording.
 */

export async function POST(req: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            req.headers.get('Authorization')?.split(' ')[1] || ''
        );

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limit: 5 transcriptions per hour per user
        if (!checkRateLimit(user.id, 'voice_transcribe', 5, 3600000)) {
            return NextResponse.json({ error: 'Rate limit exceeded. You can transcribe up to 5 recordings per hour.' }, { status: 429 });
        }

        const { recordingId, language, niche, useOwnKey, openAiKey } = await req.json();

        if (!recordingId) {
            return NextResponse.json({ error: 'Missing recordingId' }, { status: 400 });
        }

        // 1. Load recording data
        const { data: recording, error: recError } = await (supabaseAdmin
            .from('voice_recordings') as any)
            .select('*')
            .eq('id', recordingId)
            .eq('user_id', user.id)
            .single();

        if (recError || !recording) {
            return NextResponse.json({ error: 'Recording not found' }, { status: 404 });
        }

        // 2. Determine which Whisper key to use
        const whisperKey = useOwnKey && openAiKey ? openAiKey : process.env.PLATFORM_WHISPER_KEY;

        if (!whisperKey) {
            return NextResponse.json({ error: 'No Whisper API key available' }, { status: 500 });
        }

        // 3. Update status to 'processing'
        await (supabaseAdmin
            .from('voice_recordings') as any)
            .update({ transcription_status: 'processing' })
            .eq('id', recordingId);

        // 4. Start background transcription
        // Note: In Next.js App Router, we should use a background job or a task
        // for long-running operations. For now, we'll run it and return the response.
        // Ideally, this should be a separate worker.

        (async () => {
            try {
                // a. Download from Storage
                const { data: fileData, error: downloadError } = await supabaseAdmin.storage
                    .from('voice-recordings')
                    .download(recording.audio_storage_path);

                if (downloadError || !fileData) {
                    throw new Error('Failed to download audio file');
                }

                const arrayBuffer = await fileData.arrayBuffer();

                // b. Chunk if needed
                const chunks = await chunkAudioFile(arrayBuffer, fileData.type);

                if (chunks.length > 1) {
                    await (supabaseAdmin
                        .from('voice_recordings') as any)
                        .update({ transcription_status: 'chunking' })
                        .eq('id', recordingId);
                }

                // c. Transcribe
                const result = await transcribeChunks(
                    chunks,
                    whisperKey,
                    language,
                    `This is a blog or podcast recording about ${niche || 'general topics'}. The speaker may use technical terms, brand names, and domain-specific language.`
                );

                // d. Update record
                await (supabaseAdmin
                    .from('voice_recordings') as any)
                    .update({
                        transcript_raw: result.text,
                        whisper_segments: result.segments,
                        transcription_status: 'complete',
                        audio_duration_seconds: Math.round(result.segments[result.segments.length - 1]?.end || recording.audio_duration_seconds),
                        word_count_transcript: result.text.split(/\s+/).length
                    })
                    .eq('id', recordingId);

            } catch (err: any) {
                console.error('Transcription background error:', err);
                await (supabaseAdmin
                    .from('voice_recordings') as any)
                    .update({
                        transcription_status: 'failed',
                        transcription_error: err.message || 'Unknown error'
                    })
                    .eq('id', recordingId);
            }
        })();

        return NextResponse.json({ status: 'processing', recordingId });

    } catch (error: any) {
        console.error('Transcription API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
