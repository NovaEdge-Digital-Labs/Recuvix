"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BlogPostInsert, BlogPostUpdate } from '@/lib/db/adminBlogService';

interface BlogSettingsSidebarProps {
    data: Partial<BlogPostInsert | BlogPostUpdate>;
    onChange: (data: any) => void;
}

const BlogSettingsSidebar: React.FC<BlogSettingsSidebarProps> = ({ data, onChange }) => {
    const [seoExpanded, setSeoExpanded] = useState(false);

    const categories = [
        'tutorials', 'seo_tips', 'product_updates',
        'case_studies', 'guides', 'news'
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Status Section */}
            <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="published" className="text-sm font-medium">Published Status</Label>
                    <Switch
                        id="published"
                        checked={data.is_published}
                        onCheckedChange={(checked) => onChange({ is_published: checked })}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="featured" className="text-sm font-medium">Featured Post</Label>
                    <Switch
                        id="featured"
                        checked={data.is_featured}
                        onCheckedChange={(checked) => onChange({ is_featured: checked })}
                    />
                </div>
                <div className="space-y-2 pt-2">
                    <Label className="text-xs text-zinc-500 uppercase tracking-widest">Publish Date</Label>
                    <Input
                        type="datetime-local"
                        value={data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ''}
                        onChange={(e) => onChange({ published_at: new Date(e.target.value).toISOString() })}
                        className="bg-black border-white/10"
                    />
                </div>
            </div>

            {/* Classification Section */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-500 uppercase tracking-widest">Category</Label>
                    <select
                        value={data.category || ''}
                        onChange={(e) => onChange({ category: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-accent/50 outline-none appearance-none cursor-pointer"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1)}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-zinc-500 uppercase tracking-widest">Author Name</Label>
                    <Input
                        value={data.author_name || ''}
                        onChange={(e) => onChange({ author_name: e.target.value })}
                        placeholder="e.g. Amit"
                        className="bg-zinc-950 border-white/10"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-zinc-500 uppercase tracking-widest">Expert (Excerpt)</Label>
                    <Textarea
                        value={data.excerpt || ''}
                        onChange={(e) => onChange({ excerpt: e.target.value })}
                        placeholder="Brief summary for list view..."
                        className="bg-zinc-950 border-white/10 min-h-[100px] resize-none"
                    />
                </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-500 uppercase tracking-widest">Cover Image URL</Label>
                    <div className="flex gap-2">
                        <Input
                            value={data.cover_image_url || ''}
                            onChange={(e) => onChange({ cover_image_url: e.target.value })}
                            placeholder="https://..."
                            className="bg-zinc-950 border-white/10"
                        />
                    </div>
                </div>
                {data.cover_image_url && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                        <img
                            src={data.cover_image_url}
                            alt="Cover preview"
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
            </div>

            {/* SEO Section (Collapsible) */}
            <div className="pt-4">
                <button
                    onClick={() => setSeoExpanded(!seoExpanded)}
                    className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-white/5 rounded-xl text-sm font-medium hover:bg-zinc-800/50 transition-colors"
                >
                    SEO Configuration
                    {seoExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {seoExpanded && (
                    <div className="p-5 border-x border-b border-white/5 rounded-b-xl space-y-4 bg-zinc-950/30">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-xs text-zinc-400">SEO Title</Label>
                                <span className="text-[10px] text-zinc-600">{(data.title || '').length}/60</span>
                            </div>
                            <Input
                                value={data.title || ''}
                                className="bg-black border-white/5 h-9 text-sm"
                                disabled // Usually matches title, can add custom field if needed
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-xs text-zinc-400">SEO Description</Label>
                                <span className="text-[10px] text-zinc-600">{(data.excerpt || '').length}/160</span>
                            </div>
                            <Textarea
                                value={data.excerpt || ''}
                                className="bg-black border-white/5 min-h-[80px] text-sm resize-none"
                                disabled
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase">Read Time</p>
                        <p className="text-sm font-medium">{data.read_time_minutes || 5} min</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase">Words</p>
                        <p className="text-sm font-medium">~{((data.read_time_minutes || 5) * 200).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogSettingsSidebar;
