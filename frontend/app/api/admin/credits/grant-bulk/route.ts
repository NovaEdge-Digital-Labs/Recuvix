import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { grantBulkSchema } from '@/lib/validators/adminCreditsSchemas';
import { adminCreditsService } from '@/lib/db/adminCreditsService';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendHtmlEmail } from '@/lib/email/sendHtmlEmail';
import { CreditsReceivedTemplate } from '@/lib/emails/CreditsReceivedTemplate';

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const body = await req.json();
        const validated = grantBulkSchema.parse(body);

        let userIds: string[] = validated.userIds || [];

        // If no specific userIds provided, build query based on filters
        if (userIds.length === 0) {
            let query = supabaseAdmin
                .from('profiles')
                .select('id');

            if (validated.filterCountry) query = query.eq('country', validated.filterCountry);
            if (validated.filterTenantId) query = query.eq('tenant_id', validated.filterTenantId);
            if (validated.filterLabel) query = query.eq('user_label', validated.filterLabel);
            if (validated.filterNoPurchase) query = query.eq('total_credits_purchased', 0);
            if (validated.filterMinBlogs !== undefined) query = query.gte('total_blogs_generated', validated.filterMinBlogs);
            if (validated.filterMaxBlogs !== undefined) query = query.lte('total_blogs_generated', validated.filterMaxBlogs);
            if (validated.filterJoinedAfter) query = query.gte('created_at', validated.filterJoinedAfter);

            const { data: matchedUsers, error: queryError } = await query;

            if (queryError) throw queryError;
            userIds = matchedUsers.map(u => u.id);
        }

        if (validated.dryRun) {
            return NextResponse.json({
                totalMatched: userIds.length,
                dryRun: true
            });
        }

        if (userIds.length === 0) {
            return NextResponse.json({ error: 'No users matched these filters' }, { status: 404 });
        }

        // Process in batches
        const batchSize = 50;
        let totalGranted = 0;
        let totalSkipped = 0;
        let totalCreditsGiven = 0;
        const failedUserIds: string[] = [];

        const expiresAt = validated.expiresInDays
            ? new Date(Date.now() + validated.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
            : null;

        for (let i = 0; i < userIds.length; i += batchSize) {
            const currentBatch = userIds.slice(i, i + batchSize);

            await Promise.all(currentBatch.map(async (uid) => {
                try {
                    // If skipIfAlreadyGranted is true and ruleId is provided, check if user already got this rule
                    if (validated.skipIfAlreadyGranted && validated.ruleId) {
                        const { data: existing } = await supabaseAdmin
                            .from('credit_grants')
                            .select('id')
                            .eq('user_id', uid)
                            .eq('rule_id', validated.ruleId)
                            .eq('status', 'applied')
                            .maybeSingle();

                        if (existing) {
                            totalSkipped++;
                            return;
                        }
                    }

                    const grantId = await adminCreditsService.grantCredits({
                        userId: uid,
                        credits: validated.credits,
                        reason: validated.reason,
                        grantedBy: 'admin_bulk',
                        ruleId: validated.ruleId,
                        expiresAt,
                        note: validated.note
                    });

                    if (grantId) {
                        totalGranted++;
                        totalCreditsGiven += validated.credits;

                        // Notify user (Optional: could be throttled or batched)
                        const { data: profile } = await supabaseAdmin
                            .from('profiles')
                            .select('email, credits_balance')
                            .eq('id', uid)
                            .single();

                        if (profile?.email) {
                            await sendHtmlEmail({
                                to: profile.email,
                                subject: `🎁 You received ${validated.credits} free credits on Recuvix!`,
                                html: CreditsReceivedTemplate({
                                    amount: validated.credits,
                                    reason: validated.reason,
                                    newBalance: profile.credits_balance,
                                    expiresAt
                                })
                            });
                        }
                    } else {
                        failedUserIds.push(uid);
                    }
                } catch (err: any) {
                    console.error(`Failed to grant to user ${uid}:`, err);
                    failedUserIds.push(uid);
                }
            }));
        }

        return NextResponse.json({
            totalMatched: userIds.length,
            totalGranted,
            totalSkipped,
            totalCreditsGiven,
            failedUserIds
        });

    } catch (error: any) {
        console.error('API Error in grant-bulk:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to grant bulk credits' }, { status: 500 });
    }
}
