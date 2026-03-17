"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import BlogTable from '@/components/admin/blog/BlogTable';
import { deleteBlogPostAction, togglePublishAction } from '@/app/admin/blog/actions';
import { BlogPost } from '@/lib/db/adminBlogService';

interface BlogTableWrapperProps {
    posts: BlogPost[];
}

export default function BlogTableWrapper({ posts }: BlogTableWrapperProps) {
    const router = useRouter();

    const handleTogglePublish = async (post: BlogPost) => {
        const res = await togglePublishAction(post);
        if (res.success) {
            router.refresh();
        } else {
            alert(res.error || 'Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            const res = await deleteBlogPostAction(id);
            if (res.success) {
                router.refresh();
            } else {
                alert(res.error || 'Failed to delete post');
            }
        }
    };

    return (
        <BlogTable
            posts={posts}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
        />
    );
}
