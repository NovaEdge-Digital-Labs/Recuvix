import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { nanoid } from 'nanoid';
import { estimateAudioDuration } from '@/lib/voice/fileSizeEstimator';

/**
 * POST /api/voice/upload
 * Uploads an audio file to Supabase Storage and creates a record.
 */

export async function POST(req: NextRequest) {
    try {
        // 1. Get auth user
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            req.headers.get('Authorization')?.split(' ')[1] || ''
        );

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse multipart form data
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const sourceType = formData.get('sourceType') as string;
        const language = formData.get('language') as string || null;
        const workspaceId = formData.get('workspaceId') as string || null;
        const speakerName = formData.get('speakerName') as string || null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 3. Validate file
        const MAX_SIZE = 100 * 1024 * 1024; // 100MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File too large (max 100MB)' }, { status: 400 });
        }

        const allowedTypes = [
            'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/flac',
            'audio/webm', 'audio/x-m4a', 'video/mp4', 'video/webm'
        ];
        if (!allowedTypes.includes(file.type) && !file.type.startsWith('audio/')) {
            // Allow general audio/* but check specific list too
            // return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        // 4. Generate storage path: voice-recordings/{userId}/{nanoid()}.{ext}
        const ext = file.name.split('.').pop() || 'tmp';
        const filename = `${nanoid()}.${ext}`;
        const storagePath = `${user.id}/${filename}`;

        // 5. Upload to Supabase Storage
        const fileBuffer = await file.arrayBuffer();
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('voice-recordings')
            .upload(storagePath, fileBuffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 });
        }

        // 6. Estimate duration
        const estimatedDuration = estimateAudioDuration(file.size, file.type);

        // 7. Create record in Supabase
        const { data: recording, error: dbError } = await (supabaseAdmin
            .from('voice_recordings') as any)
            .insert({
                user_id: user.id,
                workspace_id: workspaceId,
                source_type: sourceType,
                original_filename: file.name,
                audio_duration_seconds: estimatedDuration,
                file_size_bytes: file.size,
                audio_language: language,
                audio_storage_path: storagePath,
                audio_storage_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                transcription_status: 'pending'
            })
            .select()
            .single();

        if (dbError) {
            console.error('DB error:', dbError);
            return NextResponse.json({ error: 'Failed to create recording record' }, { status: 500 });
        }

        // 8. Get signed URL for playback
        const { data: signedUrlData } = await supabaseAdmin.storage
            .from('voice-recordings')
            .createSignedUrl(storagePath, 3600);

        return NextResponse.json({
            recordingId: recording.id,
            filename: file.name,
            estimatedDurationSeconds: estimatedDuration,
            fileSizeBytes: file.size,
            storageUrl: signedUrlData?.signedUrl || null,
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
