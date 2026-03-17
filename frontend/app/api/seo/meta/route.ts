import { NextRequest, NextResponse } from 'next/server';
import { seoMetaSchema } from '@/lib/validators/seoSchemas';
import { generateSeoMeta } from '@/lib/services/seoService';
import { checkRateLimit } from '@/lib/utils/rateLimiter';

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
        const validation = seoMetaSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        // 4. Call Service
        const seoMeta = generateSeoMeta(validation.data);

        // 5. Return response
        return NextResponse.json(seoMeta, { status: 200 });
    } catch (error) {
        console.error('SEO Meta Error:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
