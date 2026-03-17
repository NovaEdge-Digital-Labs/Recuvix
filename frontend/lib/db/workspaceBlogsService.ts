import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type BlogRow = Database['public']['Tables']['blogs']['Row'];
type BlogInsert = Database['public']['Tables']['blogs']['Insert'];

export const workspaceBlogsService = {
    async getAll(
        workspaceId: string,
        options?: {
            limit?: number;
            offset?: number;
            orderBy?: string;
            search?: string;
            status?: 'pending' | 'approved' | 'rejected';
            generatedBy?: string;
        }
    ): Promise<{ data: BlogRow[]; count: number }> {
        const supabase = createClient();
        let query = (supabase
            .from('blogs') as any)
            .select('*', { count: 'exact' })
            .eq('workspace_id', workspaceId);

        if (options?.status) query = query.eq('approval_status', options.status);
        if (options?.generatedBy) query = query.eq('generated_by', options.generatedBy);
        if (options?.search) {
            query = query.or(
                `title.ilike.%${options.search}%,topic.ilike.%${options.search}%`
            );
        }

        const orderMap: Record<string, string> = {
            newest: 'created_at',
            oldest: 'created_at',
            az: 'title',
            za: 'title',
        };
        const orderCol = orderMap[options?.orderBy || 'newest'] || 'created_at';
        const ascending = options?.orderBy === 'oldest' || options?.orderBy === 'az';

        query = query
            .order(orderCol, { ascending })
            .range(options?.offset || 0, (options?.offset || 0) + (options?.limit || 20) - 1);

        const { data, count, error } = await query;
        if (error) throw error;
        return { data: data || [], count: count || 0 };
    },

    async create(data: BlogInsert): Promise<BlogRow> {
        const supabase = createClient();
        const { data: blog, error } = await (supabase
            .from('blogs') as any)
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return blog;
    },

    async getPendingApproval(workspaceId: string): Promise<BlogRow[]> {
        const { data } = await this.getAll(workspaceId, { status: 'pending' });
        return data;
    },

    async getStats(workspaceId: string) {
        const supabase = createClient();
        const { data, error } = await (supabase
            .from('blogs') as any)
            .select('word_count, approval_status, generated_by')
            .eq('workspace_id', workspaceId);

        if (error || !data) return { totalBlogs: 0, totalWords: 0, users: 0 };

        const uniqueUsers = new Set(data.map((b: any) => b.generated_by)).size;
        return {
            totalBlogs: data.length,
            totalWords: data.reduce((s: number, b: any) => s + (b.word_count || 0), 0),
            users: uniqueUsers,
            pendingApproval: data.filter((b: any) => b.approval_status === 'pending').length
        };
    }
};
