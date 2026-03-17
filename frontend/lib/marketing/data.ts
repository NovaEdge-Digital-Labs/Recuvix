import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Database } from '@/lib/supabase/database';

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ChangelogEntry = any;

export async function getBlogPosts(): Promise<BlogPost[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
    return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
    return data;
}

export async function getChangelogEntries(): Promise<ChangelogEntry[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await (supabase as any)
        .from('changelog_entries')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching changelog entries:', error);
        return [];
    }
    return data || [];
}
