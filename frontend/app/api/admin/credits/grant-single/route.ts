import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { grantSingleSchema } from '@/lib/validators/adminCreditsSchemas';
import { adminCreditsService } from '@/lib/db/adminCreditsService';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendHtmlEmail } from '@/lib/email/sendHtmlEmail';
import { CreditsReceivedTemplate } from '@/lib/emails/CreditsReceivedTemplate';

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const body = await req.json();
        const validated = grantSingleSchema.parse(body);

        // 1. Get user profile to check existence and current balance
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('email, credits_balance')
            .eq('id', validated.userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Grant credits
        const expiresAt = validated.expiresInDays
            ? new Date(Date.now() + validated.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
            : null;

        const grantId = await adminCreditsService.grantCredits({
            userId: validated.userId,
            credits: validated.credits,
            reason: validated.reason,
            grantedBy: 'admin',
            ruleId: validated.ruleId,
            expiresAt,
            note: validated.note
        });

        const newBalance = profile.credits_balance + validated.credits;

        // 3. Send email notification
        if (profile.email) {
            await sendHtmlEmail({
                to: profile.email,
                subject: `🎁 You received ${validated.credits} free credits on Recuvix!`,
                html: CreditsReceivedTemplate({
                    amount: validated.credits,
                    reason: validated.reason,
                    newBalance,
                    expiresAt
                })
            });
        }

        return NextResponse.json({
            success: true,
            grantId,
            newBalance
        });

    } catch (error: any) {
        console.error('API Error in grant-single:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to grant credits' }, { status: 500 });
    }
}
