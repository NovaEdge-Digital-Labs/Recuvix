import { NextResponse } from 'next/server';
import { unsubscribeUserByToken } from '@/lib/db/newsletterService';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing unsubscribe token' }, { status: 400 });
    }

    try {
        await unsubscribeUserByToken(token);

        // Simple HTML response for unsubscription confirmation
        return new NextResponse(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Unsubscribed | Recuvix</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-black text-white min-h-screen flex items-center justify-center p-6">
                <div class="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-10 text-center space-y-6">
                    <div class="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                        <svg class="w-10 h-10 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="space-y-2">
                        <h1 class="text-3xl font-bold tracking-tight">You've been unsubscribed</h1>
                        <p class="text-zinc-500">We're sorry to see you go. You will no longer receive our newsletter updates.</p>
                    </div>
                    <a href="https://recuvix.in" class="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                        Back to Home
                    </a>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    } catch (error) {
        console.error('Newsletter unsubscription error:', error);
        return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }
}
