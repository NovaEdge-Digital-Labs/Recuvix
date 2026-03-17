import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    react: React.ReactElement;
    from?: string;
}

/**
 * Utility to send emails using Resend and React Email templates.
 * @param options - to, subject, react template, optional from address
 */
export async function sendEmail({
    to,
    subject,
    react,
    from = 'Recuvix <noreply@recuvix.com>'
}: SendEmailOptions) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is missing');
            return { error: 'RESEND_API_KEY is missing' };
        }

        const data = await resend.emails.send({
            from,
            to,
            subject,
            react,
        });

        return { data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { error };
    }
}
