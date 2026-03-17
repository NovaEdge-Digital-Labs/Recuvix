import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sendEmail';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { PasswordResetEmail } from '@/emails/PasswordResetEmail';
import { CreditPurchaseReceiptEmail } from '@/emails/CreditPurchaseReceiptEmail';
import { CreditRefundEmail } from '@/emails/CreditRefundEmail';
import { WorkspaceInvitationEmail } from '@/emails/WorkspaceInvitationEmail';
import { BlogGeneratedEmail } from '@/emails/BlogGeneratedEmail';
import * as React from 'react';

/**
 * Unified API route to send transactional emails.
 * Protected by an internal API key to prevent public abuse.
 */
export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get('x-internal-key');
        if (apiKey !== process.env.INTERNAL_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { type, to, subject, props } = body;

        let template: React.ReactElement;

        switch (type) {
            case 'welcome':
                template = <WelcomeEmail { ...props } />;
                break;
            case 'password-reset':
                template = <PasswordResetEmail { ...props } />;
                break;
            case 'credit-purchase':
                template = <CreditPurchaseReceiptEmail { ...props } />;
                break;
            case 'credit-refund':
                template = <CreditRefundEmail { ...props } />;
                break;
            case 'workspace-invite':
                template = <WorkspaceInvitationEmail { ...props } />;
                break;
            case 'blog-generated':
                template = <BlogGeneratedEmail { ...props } />;
                break;
            default:
                return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
        }

        const { data, error } = await sendEmail({
            to,
            subject: subject || getDefaultSubject(type),
            react: template,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function getDefaultSubject(type: string): string {
    switch (type) {
        case 'welcome': return 'Welcome to Recuvix!';
        case 'password-reset': return 'Reset your Recuvix password';
        case 'credit-purchase': return 'Receipt for your Recuvix credits';
        case 'credit-refund': return 'Credits Refunded — Recuvix';
        case 'workspace-invite': return "You've been invited to a workspace";
        case 'blog-generated': return 'Your AI blog is ready!';
        default: return 'Recuvix Notification';
    }
}
