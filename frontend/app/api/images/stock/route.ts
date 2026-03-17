import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { stockImageSchema } from '@/lib/validators/imageSchemas';
import { fetchStockImages } from '@/lib/services/stockImageService';
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
        const validation = stockImageSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { topic, country, count, preferSource } = validation.data;

        // 4. Call Service
        const result = await fetchStockImages(topic, country, count, preferSource);

        // 5. Return response
        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Stock Images Error:', err);

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        // API limits or down
        if (err.message?.includes('Unsplash API') || err.message?.includes('Pexels API')) {
            return NextResponse.json({ error: 'External service unavailable', service: 'stock_image' }, { status: 502 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
