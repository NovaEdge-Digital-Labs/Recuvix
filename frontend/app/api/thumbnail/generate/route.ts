import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { thumbnailSchema } from '@/lib/validators/thumbnailSchemas';
import { extractColors } from '@/lib/services/colorExtractService';
import { generateThumbnail } from '@/lib/services/thumbnailService';
import { checkRateLimit } from '@/lib/utils/rateLimiter';
import { validateImageFile } from '@/lib/utils/fileValidator';
import { ThumbnailColors } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        // 2. Parse FormData
        const formData = await req.formData();

        const blogTitle = formData.get('blogTitle') as string;
        const writerName = formData.get('writerName') as string;
        const websiteUrl = formData.get('websiteUrl') as string;
        const fallbackBgColor = (formData.get('fallbackBgColor') as string) || '#1a1a2e';
        const country = (formData.get('country') as string) || 'usa';

        const logoImage = formData.get('logoImage') as File | null;
        const userImage = formData.get('userImage') as File | null;
        const colorThemeImage = formData.get('colorThemeImage') as File | null;

        // 3. Validate Inputs using Zod
        const validation = thumbnailSchema.safeParse({
            blogTitle,
            writerName,
            websiteUrl,
            fallbackBgColor,
            country
        });

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        // Validate image types if present
        if (logoImage && !validateImageFile(logoImage).isValid) {
            return NextResponse.json({ error: 'Invalid logo image' }, { status: 400 });
        }
        if (userImage && !validateImageFile(userImage).isValid) {
            return NextResponse.json({ error: 'Invalid user image' }, { status: 400 });
        }
        if (colorThemeImage && !validateImageFile(colorThemeImage).isValid) {
            return NextResponse.json({ error: 'Invalid color theme image' }, { status: 400 });
        }

        // Extract Buffers
        const logoBuffer = logoImage ? Buffer.from(await logoImage.arrayBuffer()) : undefined;
        const userBuffer = userImage ? Buffer.from(await userImage.arrayBuffer()) : undefined;
        const colorThemeBuffer = colorThemeImage ? Buffer.from(await colorThemeImage.arrayBuffer()) : undefined;

        // 4. Extract Colors
        let colors: ThumbnailColors;
        if (colorThemeBuffer) {
            colors = await extractColors(colorThemeBuffer, fallbackBgColor);
        } else {
            colors = {
                primary: fallbackBgColor,
                dark: '#1a1a2e',
                accent: '#ffffff',
            };
        }

        // 5. Generate Thumbnail (Takes some time!)
        // Note: If this takes >10s consistently we might need to use background jobs instead of a single request
        const result = await generateThumbnail({
            blogTitle: validation.data.blogTitle,
            writerName: validation.data.writerName,
            websiteUrl: validation.data.websiteUrl,
            colors,
            logoImageBuffer: logoBuffer,
            userImageBuffer: userBuffer
        });

        // 6. Return Data
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
