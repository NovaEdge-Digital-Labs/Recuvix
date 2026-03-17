import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type WPConnectionRow = Database['public']['Tables']['wordpress_connections']['Row'];
type WPConnectionInsert = Database['public']['Tables']['wordpress_connections']['Insert'];

export const wpConnectionsService = {
    async save(data: WPConnectionInsert): Promise<WPConnectionRow> {
        const supabase = createClient();
        const { data: row, error } = await (supabase
            .from('wordpress_connections') as any)
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return row;
    },

    async getAll(userId: string): Promise<WPConnectionRow[]> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('wordpress_connections') as any)
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async update(id: string, updates: Partial<WPConnectionInsert>): Promise<WPConnectionRow> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('wordpress_connections') as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await (supabase.from('wordpress_connections') as any).delete().eq('id', id);
        if (error) throw error;
    },

    async setDefault(userId: string, id: string): Promise<void> {
        const supabase = createClient();
        // First unset all
        await (supabase
            .from('wordpress_connections') as any)
            .update({ is_default: false })
            .eq('user_id', userId);
        // Then set the target one
        await (supabase
            .from('wordpress_connections') as any)
            .update({ is_default: true })
            .eq('id', id);
    },
};
