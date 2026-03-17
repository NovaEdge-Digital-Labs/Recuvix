import { NextResponse } from 'next/server';
import { getActiveSubscribers } from '@/lib/db/newsletterService';
import { sendNewsletterBatch } from '@/lib/email/newsletters';
import { NewsletterTemplate } from '@/lib/emails/NewsletterTemplate';

export async function POST(req: Request) {
    try {
        const { subject, previewText, content, isTest, testEmail } = await req.json();

        if (!subject || !content) {
            return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
        }

        if (isTest) {
            // Send test email to admin only
            const html = NewsletterTemplate({
                title: subject,
                content: content.replace(/{{name}}/g, 'Admin'),
                previewText,
                unsubscribeUrl: '#'
            });

            await sendNewsletterBatch([{
                to: testEmail || 'admin@recuvix.com',
                subject: `[TEST] ${subject}`,
                html
            }]);

            return NextResponse.json({ success: true, message: 'Test email sent' });
        }

        // Send to all active subscribers
        const subscribers = await getActiveSubscribers();

        if (subscribers.length === 0) {
            return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 });
        }

        const emails = subscribers.map((s: any) => ({
            to: s.email,
            subject: subject,
            html: NewsletterTemplate({
                title: subject,
                content: content.replace(/{{name}}/g, s.name || 'there'),
                previewText,
                unsubscribeUrl: `https://recuvix.in/api/newsletter/unsubscribe?token=${s.unsubscribe_token}`
            })
        }));

        // Send in batches
        await sendNewsletterBatch(emails);

        // TODO: Update newsletter_sends record with final stats (in production you'd use a background job/queue)

        return NextResponse.json({ success: true, recipientCount: subscribers.length });
    } catch (error) {
        console.error('Newsletter send error:', error);
        return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
    }
}
