import React from 'react';
import { getAdminBlogPostById } from '@/lib/db/adminBlogService';
import BlogForm from '@/components/admin/blog/BlogForm';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;

    try {
        const post = await getAdminBlogPostById(id);
        if (!post) return notFound();

        return <BlogForm postId={id} initialData={post} />;
    } catch (error) {
        return notFound();
    }
}
