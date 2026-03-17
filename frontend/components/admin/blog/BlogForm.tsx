"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Globe, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
const BlogEditor = dynamic(() => import('@/components/admin/blog/BlogEditor'), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] bg-zinc-900/50 animate-pulse rounded-xl" />
});
import BlogSettingsSidebar from '@/components/admin/blog/BlogSettingsSidebar';
import { createBlogPost, updateBlogPost, getAdminBlogPostById, BlogPostInsert } from '@/lib/db/adminBlogService';

interface BlogFormProps {
    postId?: string;
    initialData?: any;
}

export default function BlogForm({ postId, initialData }: BlogFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<Partial<BlogPostInsert>>({
        title: '',
        slug: '',
        content: '',
        category: 'tutorials',
        excerpt: '',
        author_name: 'Amit',
        is_published: false,
        is_featured: false,
        cover_image_url: '',
        published_at: new Date().toISOString(),
        read_time_minutes: 5,
        ...initialData
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (!postId && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            setFormData((prev: any) => ({ ...prev, slug }));
        }
    }, [formData.title, postId]);

    // Calculate read time based on word count
    useEffect(() => {
        const words = formData.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        const readTime = Math.max(1, Math.ceil(words / 200));
        setFormData((prev: any) => ({ ...prev, read_time_minutes: readTime }));
    }, [formData.content]);

    const handleSave = async (publishedStatus?: boolean) => {
        setIsSaving(true);
        try {
            const finalData = {
                ...formData,
                is_published: typeof publishedStatus === 'boolean' ? publishedStatus : formData.is_published,
                author_name: formData.author_name || 'Amit',
                category: formData.category || 'tutorials',
            } as BlogPostInsert;

            if (postId) {
                await updateBlogPost(postId, finalData);
            } else {
                await createBlogPost(finalData);
            }
            router.push('/admin/blog');
            router.refresh();
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save post. Please check the console.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blog">
                            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {postId ? 'Edit Post' : 'Create New Post'}
                            </h1>
                            <p className="text-zinc-500 text-sm">Draft your insights and tutorials.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="text-zinc-400 hover:text-white gap-2"
                            onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </Button>
                        <Button
                            onClick={() => handleSave(false)}
                            disabled={isSaving}
                            variant="secondary"
                            className="bg-zinc-900 border border-white/5 text-white hover:bg-zinc-800 px-6 gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Draft
                        </Button>
                        <Button
                            onClick={() => handleSave(true)}
                            disabled={isSaving}
                            className="bg-accent hover:bg-accent/90 text-black font-bold px-8 gap-2"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                            {formData.is_published ? 'Update Post' : 'Publish Now'}
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                    <div className="space-y-8">
                        {/* Title Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Post Title..."
                                    className="text-4xl font-bold bg-transparent border-none p-0 focus-visible:ring-0 placeholder:text-zinc-800 h-auto"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm group">
                                <span>slug:</span>
                                <span className="text-zinc-700">/blog/</span>
                                <input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="bg-transparent border-none p-0 focus-visible:ring-0 text-accent outline-none"
                                />
                            </div>
                        </div>

                        {/* Editor Component */}
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-500 uppercase tracking-widest px-1">Content</Label>
                            <BlogEditor
                                content={formData.content || ''}
                                onChange={(content) => setFormData({ ...formData, content })}
                            />
                        </div>
                    </div>

                    {/* Settings Sidebar */}
                    <div className="space-y-8">
                        <BlogSettingsSidebar
                            data={formData}
                            onChange={(newData) => setFormData({ ...formData, ...newData })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
