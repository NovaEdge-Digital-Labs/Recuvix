import { NextRequest, NextResponse } from 'next/server';
import { uploadAssetSchema } from '@/lib/validators/uploadSchemas';
import { validateImageFile } from '@/lib/utils/fileValidator';
import { processAndUploadImage } from '@/lib/services/uploadService';
import { checkRateLimit } from '@/lib/utils/rateLimiter';
import { UploadResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        // 2. Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const typeStr = formData.get('type') as string;

        if (!file) {
            return NextResponse.json({ error: 'Validation failed', details: 'File is required' }, { status: 400 });
        }

        // 3. Validate Inputs using Zod
        const typeValid = uploadAssetSchema.safeParse({ type: typeStr });
        if (!typeValid.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: typeValid.error.format() },
                { status: 400 }
            );
        }
        const type = typeValid.data.type;

        // 4. Validate File Size/Type
        const fileValidation = validateImageFile(file);
        if (!fileValidation.isValid) {
            return NextResponse.json(
                { error: 'Validation failed', details: fileValidation.error },
                { status: 400 }
            );
        }

        // 5. Convert to Buffer and Process
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await processAndUploadImage(buffer, type);

        // 6. Return response
        const responseData: UploadResponse = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Upload Error:', err);

        // Attempt to handle specific external service errors
        if (err.message?.includes('Cloudinary')) {
            return NextResponse.json(
                { error: 'External service unavailable', service: 'cloudinary' },
                { status: 502 }
            );
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
