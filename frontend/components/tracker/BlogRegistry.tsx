"use client";

import { useGSCData, TrackedBlog } from "@/hooks/useGSCData";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Edit2, Trash2, Calendar, Link as LinkIcon, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddBlogModal } from "./AddBlogModal";
import { GscImportModal } from "./GscImportModal";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export function BlogRegistry() {
    const { trackedBlogs, saveTrackedBlogs } = useGSCData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<TrackedBlog | undefined>(undefined);

    const removeBlog = (id: string) => {
        if (confirm("Remove this blog from tracking? This will delete all saved ranking history.")) {
            saveTrackedBlogs(trackedBlogs.filter(b => b.id !== id));
        }
    };

    const handleEdit = (blog: TrackedBlog) => {
        setEditingBlog(blog);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-heading font-bold">Tracked Blogs</h2>
                    <p className="text-sm text-muted-foreground">Manage the blogs you are currently tracking.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsImportModalOpen(true)}
                        className="rounded-full border-primary/30 text-primary hover:bg-primary/5"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Import from GSC
                    </Button>
                    <Button onClick={() => { setEditingBlog(undefined); setIsModalOpen(true); }} className="rounded-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Track a New Blog
                    </Button>
                </div>
            </div>

            <GscImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
            />

            {trackedBlogs.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No blogs tracked yet</h3>
                    <p className="text-sm text-muted-foreground mb-6">Add your first blog to start monitoring its search performance.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button onClick={() => setIsModalOpen(true)} variant="outline">
                            Add Your First Blog
                        </Button>
                        <Button onClick={() => setIsImportModalOpen(true)} className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                            <Search className="mr-2 h-4 w-4" />
                            Import from GSC
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {trackedBlogs.map((blog) => (
                        <div key={blog.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold font-heading line-clamp-1">{blog.title}</h3>
                                            <a
                                                href={blog.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline flex items-center mt-1"
                                            >
                                                <LinkIcon className="w-3 h-3 mr-1.5" />
                                                {blog.url}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Published {new Date(blog.publishedAt).toLocaleDateString()} ({formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true })})</span>
                                        </div>
                                        {blog.generatedAt && (
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                                <span>Generated by Recuvix</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground mr-2">
                                            <Hash className="w-3.5 h-3.5" /> Focus:
                                        </div>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                            {blog.focusKeyword}
                                        </Badge>
                                        {blog.secondaryKeywords?.map((kw) => (
                                            <Badge key={kw} variant="secondary" className="font-normal opacity-80">
                                                {kw}
                                            </Badge>
                                        ))}
                                    </div>

                                    {blog.notes && (
                                        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md border border-border/50">
                                            <strong>Notes:</strong> {blog.notes}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 lg:border-l lg:border-border lg:pl-6">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(blog)}>
                                        <Edit2 className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => removeBlog(blog.id)}>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddBlogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editingBlog={editingBlog}
            />
        </div>
    );
}

function CheckCircle({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
