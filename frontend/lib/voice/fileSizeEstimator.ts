/**
 * Estimates audio duration based on file size and common bitrates.
 * This is a rough fallback when metadata isn't available.
 */

export function estimateAudioDuration(
    fileSizeBytes: number,
    mimeType: string
): number {
    // Average bitrates in kbps
    const bitrates: Record<string, number> = {
        'audio/mpeg': 128,
        'audio/mp3': 128,
        'audio/wav': 1411,
        'audio/x-wav': 1411,
        'audio/ogg': 128,
        'audio/webm': 128,
        'audio/x-m4a': 128,
        'audio/mp4': 128,
        'video/mp4': 128, // assumes audio track is primary focus
    };

    const kbps = bitrates[mimeType] || 128;
    const bytesPerSecond = (kbps * 1000) / 8;

    return Math.round(fileSizeBytes / bytesPerSecond);
}

export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
