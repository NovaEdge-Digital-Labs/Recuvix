import { NextResponse } from 'next/server';
import { analyzeRequestSchema } from '@/lib/validators/competitorSchemas';
import { analyzeCompetitor } from '@/lib/services/competitorService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = analyzeRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: 'Invalid request',
                details: result.error.format()
            }, { status: 400 });
        }

        const { llmProvider, apiKey, scrapeData, targetCountry, userNiche } = result.data;

        try {
            const analysis = await analyzeCompetitor({
                llmProvider,
                apiKey,
                scrapeData,
                targetCountry,
                userNiche,
            });

            return NextResponse.json({ analysis });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (llmError: any) {
            console.error('LLM Analysis error:', llmError);
            return NextResponse.json({
                error: llmError.message || 'AI analysis failed'
            }, { status: 502 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Analyze API error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
