import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { apiKey, model, messages, stream } = await req.json();

        if (!apiKey || !model || !messages) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://recuvix.ai',
                'X-Title': 'Recuvix',
            },
            body: JSON.stringify({ model, messages, stream }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'OpenRouter API error' }));
            return new Response(JSON.stringify(error), { status: response.status });
        }

        // Return the stream directly
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('OpenRouter Proxy Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}
