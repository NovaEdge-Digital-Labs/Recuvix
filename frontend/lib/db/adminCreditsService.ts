import { supabaseAdmin } from '@/lib/supabase/admin';

export interface GrantCreditParams {
    userId: string;
    credits: number;
    reason: string;
    grantedBy: string;
    grantedByUserId?: string;
    ruleId?: string;
    expiresAt?: string | null;
    note?: string;
}

export const adminCreditsService = {
    async grantCredits(params: GrantCreditParams) {
        const {
            userId,
            credits,
            reason,
            grantedBy,
            grantedByUserId = null,
            ruleId = null,
            expiresAt = null,
            note = null
        } = params;

        const { data, error } = await (supabaseAdmin as any).rpc('apply_credit_grant', {
            p_user_id: userId,
            p_rule_id: ruleId,
            p_credits: credits,
            p_reason: reason,
            p_granted_by: grantedBy,
            p_granted_by_user_id: grantedByUserId,
            p_expires_at: expiresAt,
            p_note: note
        });

        if (error) throw error;
        return data;
    },

    async revokeGrant(grantId: string, reason: string) {
        // Logic: 
        // 1. Get grant details
        // 2. Deduct credits
        // 3. Mark revoked
        // 4. Record transaction

        // Get grant
        const { data: grant, error: fetchError } = await (supabaseAdmin as any)
            .from('credit_grants')
            .select('*')
            .eq('id', grantId)
            .single();

        if (fetchError) throw fetchError;
        if (grant.status !== 'applied') throw new Error('Grant is not in applied status');

        // Update profile
        const { data: profile, error: profileError } = await (supabaseAdmin as any)
            .from('profiles')
            .select('credits_balance')
            .eq('id', grant.user_id)
            .single();

        if (profileError) throw profileError;

        const newBalance = Math.max(0, profile.credits_balance - grant.credits_amount);

        await (supabaseAdmin as any).from('profiles').update({
            credits_balance: newBalance
        }).eq('id', grant.user_id);

        // Update grant
        await (supabaseAdmin as any).from('credit_grants').update({
            status: 'revoked'
        }).eq('id', grantId);

        // Create transaction
        await (supabaseAdmin as any).from('credit_transactions').insert({
            user_id: grant.user_id,
            type: 'revocation',
            amount: -grant.credits_amount,
            balance_after: newBalance,
            description: `Revoked: ${reason} (Original: ${grant.reason})`,
            reference_id: grantId
        });

        return { success: true, newBalance };
    },

    async getHistory(limit = 50, offset = 0) {
        const { data, error, count } = await (supabaseAdmin as any)
            .from('credit_grants')
            .select(`
                *,
                profile:profiles(id, full_name, email),
                rule:credit_rules(name)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return { data, total: count || 0 };
    }
};
