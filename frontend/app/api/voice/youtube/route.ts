import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/voice/youtube
 * Placeholder for YouTube audio extraction (V1).
 */

export async function POST(req: NextRequest) {
    return NextResponse.json({
        status: "not_implemented",
        message: "YouTube extraction is not available yet due to legal safety. Please download the audio from YouTube manually and upload it using the file upload option.",
        suggestedTools: [
            { name: "ytmp3.cc", url: "https://ytmp3.cc" },
            { name: "y2mate.com", url: "https://y2mate.com" }
        ]
    }, { status: 501 });
}
