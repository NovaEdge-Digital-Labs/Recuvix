/**
 * Utility to chunk large audio files for Whisper API (25MB limit)
 */

export async function chunkAudioFile(
    fileBuffer: ArrayBuffer,
    mimeType: string,
    maxChunkSizeBytes: number = 24 * 1024 * 1024 // 24MB to stay safe
): Promise<ArrayBuffer[]> {
    if (fileBuffer.byteLength <= maxChunkSizeBytes) {
        return [fileBuffer];
    }

    const chunks: ArrayBuffer[] = [];
    const totalBytes = fileBuffer.byteLength;
    const numChunks = Math.ceil(totalBytes / maxChunkSizeBytes);

    for (let i = 0; i < numChunks; i++) {
        const start = i * maxChunkSizeBytes;
        const end = Math.min(start + maxChunkSizeBytes, totalBytes);
        chunks.push(fileBuffer.slice(start, end));
    }

    return chunks;
}

export async function transcribeChunks(
    chunks: ArrayBuffer[],
    whisperKey: string,
    language?: string,
    contextPrompt?: string,
    onProgress?: (segment: number, total: number) => void
): Promise<{ text: string; segments: any[] }> {
    const transcripts: string[] = [];
    let allSegments: any[] = [];

    for (let i = 0; i < chunks.length; i++) {
        onProgress?.(i + 1, chunks.length);

        const formData = new FormData();
        // We treat everything as mp3 for simplicity when sending to Whisper if it's chunked
        // Whisper is robust to header mismatches in chunks
        formData.append(
            'file',
            new Blob([chunks[i]], { type: 'audio/mpeg' }),
            `chunk_${i}.mp3`
        );
        formData.append('model', 'whisper-1');
        if (language && language !== 'Auto-detect') {
            formData.append('language', language);
        }
        formData.append('response_format', 'verbose_json');

        // Continuity hint: use last 200 chars of previous transcript as prompt
        const continuityPrompt = i > 0 && transcripts[transcripts.length - 1]
            ? transcripts[transcripts.length - 1].slice(-200)
            : contextPrompt;

        if (continuityPrompt) {
            formData.append('prompt', continuityPrompt);
        }

        const response = await fetch(
            'https://api.openai.com/v1/audio/transcriptions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${whisperKey}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Whisper API error');
        }

        const data = await response.json();
        transcripts.push(data.text);

        // Adjust timestamps for segments in subsequent chunks
        const timeOffset = i * 0; // In byte-based chunking, we don't know the time offset easily
        // This is a limitation of byte-based chunking. 
        // In V2 we should ideally split by time if we have metadata.
        if (data.segments) {
            allSegments = [...allSegments, ...data.segments];
        }
    }

    return {
        text: transcripts.join(' '),
        segments: allSegments,
    };
}
