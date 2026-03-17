import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;
        const body = await req.json();
        const isDryRun = body.dryRun === true;

        // 1. Get the rule
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;
        const { data: rule, error: ruleError } = await db
            .from('credit_rules')
            .select('*')
            .eq('id', id)
            .single();

        if (ruleError || !rule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        // 2. Build user query based on rule conditions
        let query = (supabaseAdmin.from('profiles').select('id') as any);

        if (rule.condition_country) query = query.eq('country', rule.condition_country);
        if (rule.condition_tenant_id) query = query.eq('tenant_id', rule.condition_tenant_id);
        if (rule.condition_min_blogs !== null) query = query.gte('total_blogs_generated', rule.condition_min_blogs);
        if (rule.condition_max_blogs !== null) query = query.lte('total_blogs_generated', rule.condition_max_blogs);
        if (rule.condition_joined_after) query = query.gte('created_at', rule.condition_joined_after);
        if (rule.condition_joined_before) query = query.lte('created_at', rule.condition_joined_before);
        if (rule.condition_no_previous_purchase) query = query.eq('total_credits_purchased', 0);
        if (rule.condition_has_byok !== null) query = query.eq('managed_mode_enabled', !rule.condition_has_byok);

        const { data: matchedUsers, error: queryError } = await query;
        if (queryError) throw queryError;

        const userIds = matchedUsers.map((u: { id: string }) => u.id);

        if (isDryRun) {
            return NextResponse.json({
                totalMatched: userIds.length,
                dryRun: true
            });
        }

        // 3. Trigger bulk grant via the grant-bulk logic (internally)
        // For simplicity, we'll just redirect the logic here
        const response = await fetch(`${new URL(req.url).origin}/api/admin/credits/grant-bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.get('cookie') || ''
            },
            body: JSON.stringify({
                userIds,
                credits: rule.credits_amount,
                reason: rule.name,
                ruleId: rule.id,
                expiresInDays: rule.credits_expire_days,
                skipIfAlreadyGranted: rule.max_grants_per_user === 1
            })
        });

        const result = await response.json();
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('API Error in trigger-rule:', error);
        return NextResponse.json({ error: error.message || 'Failed to trigger rule' }, { status: 500 });
    }
}
