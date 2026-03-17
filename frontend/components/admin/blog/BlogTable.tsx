import React from 'react';
import Link from 'next/link';
import {
    Edit,
    Trash2,
    Eye,
    ExternalLink,
    CheckCircle2,
    XCircle,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BlogPost } from '@/lib/db/adminBlogService';

interface BlogTableProps {
    posts: BlogPost[];
    onTogglePublish: (post: BlogPost) => void;
    onDelete: (id: string) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({ posts, onTogglePublish, onDelete }) => {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="group hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                                            {post.title}
                                        </span>
                                        <span className="text-xs text-zinc-500 font-mono mt-0.5">/{post.slug}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 capitalize">
                                        {post.category?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {post.is_published ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                <span className="text-xs text-zinc-300">Published</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3.5 h-3.5 text-zinc-500" />
                                                <span className="text-xs text-zinc-500">Draft</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-zinc-400">
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/blog/${post.id}/edit`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-400 hover:text-white"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </Link>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-400">
                                                <DropdownMenuItem
                                                    onClick={() => onTogglePublish(post)}
                                                    className="hover:bg-white/5 cursor-pointer"
                                                >
                                                    {post.is_published ? 'Unpublish' : 'Publish'}
                                                </DropdownMenuItem>
                                                <Link href={`/blog/${post.slug}`} target="_blank">
                                                    <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                                                        <span className="flex items-center gap-2">View Live <ExternalLink className="w-3 h-3" /></span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(post.id)}
                                                    className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-zinc-500 text-sm">No blog posts found.</p>
                        <Link href="/admin/blog/new">
                            <Button variant="link" className="text-accent mt-2">
                                Create your first post
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogTable;
