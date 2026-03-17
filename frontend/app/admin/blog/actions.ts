'use server';

import { deleteBlogPost, updateBlogPost, BlogPost } from '@/lib/db/adminBlogService';
import { revalidatePath } from 'next/cache';

export async function deleteBlogPostAction(id: string) {
    try {
        await deleteBlogPost(id);
        revalidatePath('/admin/blog');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete blog post' };
    }
}

export async function togglePublishAction(post: BlogPost) {
    try {
        await updateBlogPost(post.id, { is_published: !post.is_published });
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update post status' };
    }
}
