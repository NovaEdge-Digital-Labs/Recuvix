import { NextResponse } from 'next/server';
import { briefRequestSchema } from '@/lib/validators/competitorSchemas';
import { generateCompetitorBrief } from '@/lib/services/competitorService';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = briefRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: 'Invalid request',
                details: result.error.format()
            }, { status: 400 });
        }

        const { llmProvider, apiKey, scrapeData, analysis, targetCountry, userTone, userWordCount } = result.data;

        try {
            const brief = await generateCompetitorBrief({
                llmProvider,
                apiKey,
                scrapeData,
                analysis,
                targetCountry,
                userTone,
                userWordCount,
            });

            return NextResponse.json({ brief });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (llmError: any) {
            console.error('LLM Brief error:', llmError);
            return NextResponse.json({
                error: llmError.message || 'Brief generation failed'
            }, { status: 502 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Brief API error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
