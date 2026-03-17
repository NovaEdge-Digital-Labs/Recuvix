import React from 'react';
import Link from 'next/link';
import { Plus, Newspaper, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAdminBlogPosts } from '@/lib/db/adminBlogService';
import BlogTableWrapper from '@/components/admin/blog/BlogTableWrapper';

export default async function AdminBlogListPage() {
    const posts = (await getAdminBlogPosts()) as any[];

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Breadcrumbs / Back */}
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white -ml-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
                            <Newspaper className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Blog CMS</h1>
                            <p className="text-zinc-500 text-sm">Manage your platform insights, tutorials, and case studies.</p>
                        </div>
                    </div>

                    <Link href="/admin/blog/new">
                        <Button className="bg-accent hover:bg-accent/90 text-black font-bold px-6">
                            <Plus className="w-4 h-4 mr-2" />
                            New Post
                        </Button>
                    </Link>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Total Posts</p>
                        <p className="text-2xl font-bold">{posts.length}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Published</p>
                        <p className="text-2xl font-bold">{posts.filter(p => p.is_published).length}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Drafts</p>
                        <p className="text-2xl font-bold">{posts.filter(p => !p.is_published).length}</p>
                    </div>
                </div>

                {/* Content */}
                <BlogTableWrapper posts={posts} />
            </div>
        </div>
    );
}
