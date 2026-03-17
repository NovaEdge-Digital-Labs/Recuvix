import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { revokeGrantSchema } from '@/lib/validators/adminCreditsSchemas';
import { adminCreditsService } from '@/lib/db/adminCreditsService';
import { sendHtmlEmail } from '@/lib/email/sendHtmlEmail';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const body = await req.json();
        const validated = revokeGrantSchema.parse(body);

        // 1. Get grant info
        const { data: grant, error: grantError } = await supabaseAdmin
            .from('credit_grants')
            .select('*, profiles(email)')
            .eq('id', validated.grantId)
            .single();

        if (grantError || !grant) {
            return NextResponse.json({ error: 'Grant not found' }, { status: 404 });
        }

        if (grant.status !== 'applied') {
            return NextResponse.json({ error: `Cannot revoke grant with status: ${grant.status}` }, { status: 400 });
        }

        // 2. Performance revocation
        const result = await adminCreditsService.revokeGrant(validated.grantId, validated.reason);

        // 3. Notify user
        const userEmail = (grant.profiles as any)?.email;
        if (userEmail) {
            await sendHtmlEmail({
                to: userEmail,
                subject: `⚠️ Credit Grant Revoked on Recuvix`,
                html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #ef4444;">Notice: Credits Revoked</h2>
            <p>Hello,</p>
            <p>Please be informed that a previous credit grant of <strong>${grant.credits_amount} credits</strong> has been revoked from your account.</p>
            <p><strong>Reason:</strong> ${validated.reason}</p>
            <p>Your new balance is: <strong>${result.newBalance} credits</strong>.</p>
            <p>If you believe this is an error, please contact support.</p>
            <p>— The Recuvix Team</p>
          </div>
        `
            });
        }

        return NextResponse.json({ success: true, newBalance: result.newBalance });

    } catch (error: any) {
        console.error('API Error in revoke:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to revoke grant' }, { status: 500 });
    }
}
