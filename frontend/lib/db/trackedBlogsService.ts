import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type TrackedBlogRow = Database['public']['Tables']['tracked_blogs']['Row'];
type TrackedBlogInsert = Database['public']['Tables']['tracked_blogs']['Insert'];

export const trackedBlogsService = {
    async add(data: TrackedBlogInsert): Promise<TrackedBlogRow> {
        const supabase = createClient();
        const { data: row, error } = await (supabase
            .from('tracked_blogs') as any)
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return row;
    },

    async getAll(userId: string): Promise<TrackedBlogRow[]> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('tracked_blogs') as any)
            .select('*')
            .eq('user_id', userId)
            .order('added_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async update(id: string, updates: Partial<TrackedBlogInsert>): Promise<TrackedBlogRow> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('tracked_blogs') as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async remove(id: string): Promise<void> {
        const supabase = createClient();
        const { error } = await (supabase.from('tracked_blogs' as any) as any).delete().eq('id', id);
        if (error) throw error;
    },
};
