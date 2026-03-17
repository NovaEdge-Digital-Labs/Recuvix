import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type SnapshotRow = Database['public']['Tables']['ranking_snapshots']['Row'];
type SnapshotInsert = Database['public']['Tables']['ranking_snapshots']['Insert'];

export const rankingService = {
    async saveSnapshot(data: SnapshotInsert): Promise<SnapshotRow> {
        const supabase = createClient();
        const { data: row, error } = await (supabase
            .from('ranking_snapshots') as any)
            .upsert(data, { onConflict: 'tracked_blog_id,snapshot_date,keyword' })
            .select()
            .single();
        if (error) throw error;
        return row;
    },

    async getSnapshots(trackedBlogId: string, limit = 90): Promise<SnapshotRow[]> {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('ranking_snapshots') as any)
            .select('*')
            .eq('tracked_blog_id', trackedBlogId)
            .order('snapshot_date', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    },

    async deleteOldSnapshots(trackedBlogId: string, keepDays = 90): Promise<void> {
        const supabase = createClient();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - keepDays);
        await (supabase
            .from('ranking_snapshots') as any)
            .delete()
            .eq('tracked_blog_id', trackedBlogId)
            .lt('snapshot_date', cutoff.toISOString().split('T')[0]);
    },
};
