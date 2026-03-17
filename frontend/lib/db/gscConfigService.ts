import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type GscConfigRow = Database['public']['Tables']['gsc_configs']['Row'];
type GscConfigInsert = Database['public']['Tables']['gsc_configs']['Insert'];

export const gscConfigService = {
    async save(data: GscConfigInsert): Promise<GscConfigRow> {
        const supabase = createClient();
        const { data: row, error } = await (supabase
            .from('gsc_configs') as any)
            .upsert({ ...data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
            .select()
            .single();
        if (error) throw error;
        return row;
    },

    async get(userId: string): Promise<GscConfigRow | null> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('gsc_configs') as any)
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) return null;
        return data;
    },

    async delete(userId: string): Promise<void> {
        const supabase = createClient();
        await (supabase.from('gsc_configs') as any).delete().eq('user_id', userId);
    },
};
