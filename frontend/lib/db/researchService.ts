import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type ResearchRow = Database['public']['Tables']['research_history']['Row'];
type ResearchInsert = Database['public']['Tables']['research_history']['Insert'];

export const researchService = {
    async save(data: ResearchInsert): Promise<ResearchRow> {
        const supabase = createClient();
        const { data: row, error } = await (supabase
            .from('research_history') as any)
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return row;
    },

    async getAll(userId: string, limit = 50): Promise<ResearchRow[]> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('research_history') as any)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await (supabase.from('research_history' as any) as any).delete().eq('id', id);
        if (error) throw error;
    },
};
