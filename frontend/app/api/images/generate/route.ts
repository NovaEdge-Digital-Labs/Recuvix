import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { generatedImageSchema } from '@/lib/validators/imageSchemas';
import { generateAiImage } from '@/lib/services/aiImageService';
import { checkRateLimit } from '@/lib/utils/rateLimiter';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        // 2. Parse body
        const bodyText = await req.text();
        if (!bodyText) {
            return NextResponse.json({ error: 'Body required' }, { status: 400 });
        }
        const body = JSON.parse(bodyText);

        // 3. Validate Inputs using Zod
        const validation = generatedImageSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { prompt, country, style } = validation.data;

        // 4. Call AI Generation Service
        const aiResult = await generateAiImage(prompt, country, style);

        // 5. Upload resulting URL to Cloudinary so we can return a Cloudinary URL
        // (Optimization as requested in instructions block)
        const uploadResult = await cloudinary.uploader.upload(aiResult.imageUrl, {
            folder: 'bloggen/ai_images',
        });

        // 6. Return response
        return NextResponse.json({ imageUrl: uploadResult.secure_url }, { status: 200 });

    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('AI Generate Error:', err);

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        if (err.message?.includes('Replicate')) {
            return NextResponse.json({ error: 'External service unavailable', service: 'replicate' }, { status: 502 });
        }

        if (err.message?.includes('Cloudinary')) {
            return NextResponse.json({ error: 'External service unavailable', service: 'cloudinary' }, { status: 502 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
