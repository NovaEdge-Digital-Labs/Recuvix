import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { thumbnailSchema } from '@/lib/validators/thumbnailSchemas';
import { extractColors } from '@/lib/services/colorExtractService';
import { generateThumbnail } from '@/lib/services/thumbnailService';
import { checkRateLimit } from '@/lib/utils/rateLimiter';
import { ThumbnailColors } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        // 2. Parse JSON body
        const body = await req.json();

        // 3. Validate Inputs using Zod
        const validation = thumbnailSchema.safeParse({
            blogTitle: body.blogTitle || '',
            writerName: body.writerName || '',
            websiteUrl: body.websiteUrl || '',
            fallbackBgColor: body.fallbackBgColor || '#1a1a2e',
            country: body.country || 'usa'
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        // Helper to fetch images into Buffer
        const fetchImageBuffer = async (url?: string): Promise<Buffer | undefined> => {
            if (!url) return undefined;
            try {
                const response = await fetch(url);
                if (!response.ok) return undefined;
                return Buffer.from(await response.arrayBuffer());
            } catch (e) {
                console.warn(`Failed to fetch image from URL: ${url}`, e);
                return undefined;
            }
        };

        // 4. Fetch Images from URLs into Buffers
        const logoBuffer = await fetchImageBuffer(body.logoUrl);
        const userBuffer = await fetchImageBuffer(body.userPhotoUrl);
        const colorThemeBuffer = await fetchImageBuffer(body.colorThemeUrl);

        // 5. Extract Colors
        let colors: ThumbnailColors;
        if (colorThemeBuffer) {
            colors = await extractColors(colorThemeBuffer, validation.data.fallbackBgColor);
        } else {
            colors = {
                primary: validation.data.fallbackBgColor,
                dark: '#1a1a2e',
                accent: '#ffffff',
            };
        }

        // 6. Generate Thumbnail (Takes some time!)
        const result = await generateThumbnail({
            blogTitle: validation.data.blogTitle,
            writerName: validation.data.writerName,
            websiteUrl: validation.data.websiteUrl,
            colors,
            logoImageBuffer: logoBuffer,
            userImageBuffer: userBuffer
        });

        // 7. Return Data
        return NextResponse.json(result, { status: 200 });

    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Thumbnail Generation Error:', err);

        if (err.message?.includes('Cloudinary')) {
            return NextResponse.json({ error: 'External service unavailable', service: 'cloudinary' }, { status: 502 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
