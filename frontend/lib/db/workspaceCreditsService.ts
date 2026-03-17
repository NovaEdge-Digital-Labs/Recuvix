import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type TransactionRow = Database['public']['Tables']['workspace_credit_transactions']['Row'];

export const workspaceCreditsService = {
    async getBalance(workspaceId: string): Promise<number> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .select('credits_balance')
            .eq('id', workspaceId)
            .single();
        if (error) return 0;
        return (data as any).credits_balance || 0;
    },

    async getTransactions(workspaceId: string, limit = 50): Promise<TransactionRow[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspace_credit_transactions')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    },

    async getMemberUsage(workspaceId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('workspace_members')
            .select('user_id, invited_email, created_at, role')
            .eq('workspace_id', workspaceId)
            .eq('status', 'active');

        if (error) throw error;
        return data || [];
    }
};
