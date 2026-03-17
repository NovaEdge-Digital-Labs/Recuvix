import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';
import { SupabaseClient } from '@supabase/supabase-js';

type BlogRow = Database['public']['Tables']['blogs']['Row'];
type BlogInsert = Database['public']['Tables']['blogs']['Insert'];

export const blogsService = {
    async create(data: BlogInsert): Promise<BlogRow> {
        const supabase = createClient() as any;
        const { data: blog, error } = await supabase
            .from('blogs')
            .insert(data)
            .select()
            .single();
        if (error) throw error;

        // Referral Reward Logic
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('referred_by_user_id, total_blogs_generated')
                .eq('id', data.user_id)
                .single();

            // If referred by someone and this is the first blog
            if (profile?.referred_by_user_id) {
                // Check if already converted to be safe
                const { data: referral } = await supabase
                    .from('referrals')
                    .select('status')
                    .eq('referred_user_id', data.user_id)
                    .eq('status', 'signed_up')
                    .maybeSingle();

                if (referral) {
                    // 1. Update referral status to converted
                    await supabase
                        .from('referrals')
                        .update({
                            status: 'converted',
                            converted_at: new Date().toISOString()
                        })
                        .eq('referred_user_id', data.user_id);

                    // 2. Grant 5 credits to referrer
                    await supabase.rpc('apply_credit_grant', {
                        p_user_id: profile.referred_by_user_id,
                        p_credits: 5,
                        p_reason: 'Referral Reward',
                        p_granted_by: 'System (Referral)',
                        p_note: `Referral conversion from user ${data.user_id}`
                    });

                    // 3. Update referral status to rewarded
                    await supabase
                        .from('referrals')
                        .update({
                            status: 'rewarded',
                            rewarded_at: new Date().toISOString(),
                            credits_rewarded: 5
                        })
                        .eq('referred_user_id', data.user_id);

                    // 4. Update referrer's earned credits stat
                    await supabase.rpc('increment_referral_credits', {
                        p_user_id: profile.referred_by_user_id,
                        p_amount: 5
                    });

                    // 5. Notify the referrer
                    await supabase
                        .from('notifications')
                        .insert({
                            user_id: profile.referred_by_user_id,
                            title: 'Referral Reward Earned! 🎁',
                            message: 'One of your friends just generated their first blog. You have been earned 5 free credits!',
                            type: 'reward',
                            link: '/profile#refer'
                        });
                }
            }
        } catch (err) {
            console.error('Referral reward error:', err);
        }

        return blog;
    },

    async getAll(
        userId: string,
        options?: {
            limit?: number;
            offset?: number;
            orderBy?: string;
            starred?: boolean;
            tags?: string[];
            search?: string;
            country?: string;
            model?: string;
            wordCountMin?: number;
            wordCountMax?: number;
            workspaceId?: string;
        }
    ): Promise<{ data: BlogRow[]; count: number }> {
        const supabase = createClient() as any;
        let query = supabase
            .from('blogs')
            .select('*', { count: 'exact' })
            .eq('user_id', userId);

        if (options?.workspaceId) query = query.eq('workspace_id', options.workspaceId);

        if (options?.starred) query = query.eq('is_starred', true);
        if (options?.tags?.length) query = query.overlaps('tags', options.tags);
        if (options?.country) query = query.eq('country', options.country);
        if (options?.model) query = query.eq('model', options.model);
        if (options?.wordCountMin) query = query.gte('word_count', options.wordCountMin);
        if (options?.wordCountMax) query = query.lte('word_count', options.wordCountMax);
        if (options?.search) {
            query = query.or(
                `title.ilike.%${options.search}%,topic.ilike.%${options.search}%,focus_keyword.ilike.%${options.search}%`
            );
        }

        const orderMap: Record<string, string> = {
            newest: 'created_at',
            oldest: 'created_at',
            az: 'title',
            za: 'title',
            most_words: 'word_count',
            recently_viewed: 'last_viewed_at',
        };
        const orderCol = orderMap[options?.orderBy || 'newest'] || 'created_at';
        const ascending = ['oldest', 'az'].includes(options?.orderBy || 'newest');

        query = query
            .order(orderCol, { ascending })
            .range(options?.offset || 0, (options?.offset || 0) + (options?.limit || 20) - 1);

        const { data, count, error } = await query;
        if (error) throw error;
        return { data: data || [], count: count || 0 };
    },

    async getById(id: string): Promise<BlogRow | null> {
        const supabase = createClient() as any;
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();
        if (error) return null;
        return data as BlogRow;
    },

    async update(id: string, updates: Partial<BlogInsert>): Promise<BlogRow> {
        const supabase = createClient() as any;
        const { data, error } = await supabase
            .from('blogs')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as BlogRow;
    },

    async delete(id: string): Promise<void> {
        const supabase = createClient() as any;
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
    },

    async deleteMany(ids: string[]): Promise<void> {
        const supabase = createClient() as any;
        const { error } = await supabase.from('blogs').delete().in('id', ids);
        if (error) throw error;
    },

    async toggleStar(id: string, currentValue: boolean): Promise<void> {
        const supabase = createClient() as any;
        await supabase.from('blogs').update({ is_starred: !currentValue }).eq('id', id);
    },

    async updateTags(id: string, tags: string[]): Promise<void> {
        const supabase = createClient() as any;
        await supabase.from('blogs').update({ tags }).eq('id', id);
    },

    async markViewed(id: string): Promise<void> {
        const supabase = createClient() as any;
        await supabase
            .from('blogs')
            .update({ last_viewed_at: new Date().toISOString() })
            .eq('id', id);
    },

    async getStats(userId: string) {
        const supabase = createClient() as any;
        const { data } = await supabase
            .from('blogs')
            .select('word_count, is_starred, country, model')
            .eq('user_id', userId);
        if (!data) {
            return { totalEntries: 0, totalWords: 0, starredCount: 0, uniqueCountries: 0, uniqueModels: 0 };
        }
        return {
            totalEntries: data.length,
            totalWords: data.reduce((s: number, b: any) => s + (b.word_count || 0), 0),
            starredCount: data.filter((b: any) => b.is_starred).length,
            uniqueCountries: new Set(data.map((b: any) => b.country)).size,
            uniqueModels: new Set(data.map((b: any) => b.model)).size,
        };
    },

    async getAllTags(userId: string): Promise<string[]> {
        const supabase = createClient() as any;
        const { data, error } = await supabase
            .from('blogs')
            .select('tags')
            .eq('user_id', userId);
        if (error || !data) return [];
        const tags = new Set<string>();
        data.forEach((row: any) => {
            if (Array.isArray(row.tags)) {
                row.tags.forEach((t: string) => tags.add(t));
            }
        });
        return Array.from(tags).sort();
    },

    async getByTitle(userId: string, title: string): Promise<BlogRow | null> {
        const supabase = createClient() as any;
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('user_id', userId)
            .eq('title', title)
            .maybeSingle();

        if (error) throw error;
        return data as unknown as BlogRow || null;
    },
};
