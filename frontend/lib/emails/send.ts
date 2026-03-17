import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';
import CreditPurchaseEmail from '@/emails/CreditPurchaseEmail';
import CreditRefundEmail from '@/emails/CreditRefundEmail';
import FreeCreditsEmail from '@/emails/FreeCreditsEmail';
import WorkspaceInviteEmail from '@/emails/WorkspaceInviteEmail';
import PasswordResetEmail from '@/emails/PasswordResetEmail';
import BlogPublishedEmail from '@/emails/BlogPublishedEmail';
import NewsletterWelcomeEmail from '@/emails/NewsletterWelcomeEmail';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Recuvix <noreply@recuvix.in>';

type TemplateType =
    | 'welcome'
    | 'purchase'
    | 'refund'
    | 'free-credits'
    | 'invite'
    | 'password-reset'
    | 'blog-published'
    | 'newsletter-welcome';

interface SendEmailParams {
    to: string | string[];
    subject: string;
    template: TemplateType;
    data: any;
}

export const sendEmail = async ({ to, subject, template, data }: SendEmailParams) => {
    let EmailComponent: React.ComponentType<any>;

    switch (template) {
        case 'welcome':
            EmailComponent = WelcomeEmail;
            break;
        case 'purchase':
            EmailComponent = CreditPurchaseEmail;
            break;
        case 'refund':
            EmailComponent = CreditRefundEmail;
            break;
        case 'free-credits':
            EmailComponent = FreeCreditsEmail;
            break;
        case 'invite':
            EmailComponent = WorkspaceInviteEmail;
            break;
        case 'password-reset':
            EmailComponent = PasswordResetEmail;
            break;
        case 'blog-published':
            EmailComponent = BlogPublishedEmail;
            break;
        case 'newsletter-welcome':
            EmailComponent = NewsletterWelcomeEmail;
            break;
        default:
            throw new Error(`Unknown email template: ${template}`);
    }

    try {
        const { data: resData, error } = await resend.emails.send({
            from: fromEmail,
            to,
            subject,
            react: React.createElement(EmailComponent, data),
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        return { success: true, data: resData };
    } catch (err) {
        console.error('Failed to send email:', err);
        return { success: false, error: err };
    }
};
