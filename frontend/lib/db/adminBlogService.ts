import { supabaseAdmin } from '@/lib/supabase/admin';
import { Database } from '@/lib/supabase/database';

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export async function getAdminBlogPosts() {
    const { data, error } = await (supabaseAdmin as any)
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching admin blog posts:', error);
        throw error;
    }
    return data || [];
}

export async function getAdminBlogPostById(id: string) {
    const { data, error } = await (supabaseAdmin as any)
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching blog post by id:', error);
        throw error;
    }
    return data;
}

export async function createBlogPost(post: any) {
    const { data, error } = await (supabaseAdmin as any)
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

    if (error) {
        console.error('Error creating blog post:', error);
        throw error;
    }
    return data;
}

export async function updateBlogPost(id: string, post: any) {
    const { data, error } = await (supabaseAdmin as any)
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
    return data;
}

export async function deleteBlogPost(id: string) {
    const { error } = await (supabaseAdmin as any)
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog post:', error);
        throw error;
    }
    return true;
}
