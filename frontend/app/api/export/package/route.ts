import { NextRequest, NextResponse } from 'next/server';
import { exportSchema } from '@/lib/validators/exportSchemas';
import { generateExportContent } from '@/lib/services/exportService';
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
        const validation = exportSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { outputFormat, seoMeta } = validation.data;

        // 4. Generate content
        const contentString = generateExportContent(validation.data);

        // 5. Build File Response
        const filename = `${seoMeta.slug}.${outputFormat}`;
        let contentType = 'text/plain';

        if (outputFormat === 'html') contentType = 'text/html; charset=utf-8';
        if (outputFormat === 'md') contentType = 'text/markdown; charset=utf-8';
        if (outputFormat === 'xml') contentType = 'application/xml; charset=utf-8';

        const headers = new Headers();
        headers.set('Content-Type', contentType);
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);

        return new NextResponse(contentString, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Export Error:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
