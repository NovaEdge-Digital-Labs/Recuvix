import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendHtmlEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

/**
 * Utility to send emails using raw HTML.
 */
export async function sendHtmlEmail({
    to,
    subject,
    html,
    from = 'Recuvix <noreply@recuvix.com>'
}: SendHtmlEmailOptions) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return { error: 'RESEND_API_KEY is missing' };
        }

        const data = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        return { data };
    } catch (error) {
        console.error('Error sending HTML email:', error);
        return { error };
    }
}
