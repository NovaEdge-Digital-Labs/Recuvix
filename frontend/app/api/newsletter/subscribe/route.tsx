import { NextRequest, NextResponse } from 'next/server';
import { subscribeUser } from '@/lib/db/newsletterService';
import { sendEmail } from '@/lib/email/sendEmail';
import { NewsletterTemplate } from '@/lib/emails/NewsletterTemplate';
import { checkRateLimit } from '@/lib/utils/rateLimiter';

export async function POST(req: NextRequest) {
    try {
        // Rate limit: 5 subscriptions per hour per IP
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
        if (!checkRateLimit(ip, 'newsletter_subscribe', 5, 3600000)) {
            return NextResponse.json({ error: 'Too many subscription attempts. Please wait before trying again.' }, { status: 429 });
        }

        const { email, name, source } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        // 1. Upsert into database
        const subscriber = await subscribeUser({ email, name, source });

        // 2. Send welcome email
        const welcomeHtml = NewsletterTemplate({
            title: 'Welcome to Recuvix!',
            content: `
                <h2>Welcome to the future of AI content, ${name || 'there'}!</h2>
                <p>We're thrilled to have you on board. You'll be the first to know about our latest AI insights, SEO tips, and product updates.</p>
                <p>Stay tuned for some amazing content coming your way.</p>
                <a href="https://recuvix.in/dashboard" class="btn">Explore Recuvix</a>
            `,
            unsubscribeUrl: `https://recuvix.in/api/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`
        });

        await sendEmail({
            to: email,
            subject: 'Welcome to the Recuvix Newsletter!',
            react: <div dangerouslySetInnerHTML={{ __html: welcomeHtml }} /> as any
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
