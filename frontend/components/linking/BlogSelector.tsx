import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/components/ui/select";
import { Link as LinkIcon, FileText, AlertCircle } from 'lucide-react';

interface BlogSelectorProps {
    blogs: any[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    className?: string;
}

export function BlogSelector({ blogs, selectedId, onSelect, className }: BlogSelectorProps) {
    // Group blogs
    const orphans = blogs.filter(b => b.internal_links_count === 0);
    const recent = blogs.slice(0, 10);
    const rest = blogs.slice(10);

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-[10px] uppercase font-bold text-zinc-500 ml-1">
                Select Source Blog
            </label>
            <Select value={selectedId || undefined} onValueChange={onSelect}>
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800 text-zinc-200 focus:ring-accent/20 h-12">
                    <SelectValue placeholder="Search and select a blog to link from..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-300 max-h-[400px]">
                    {orphans.length > 0 && (
                        <SelectGroup>
                            <SelectLabel className="text-red-400 flex items-center gap-1.5 px-3 py-2 border-b border-zinc-900">
                                <AlertCircle className="h-3.5 w-3.5" /> Orphan Blogs (0 Links)
                            </SelectLabel>
                            {orphans.map(blog => (
                                <SelectItem
                                    key={blog.id}
                                    value={blog.id}
                                    className="hover:bg-zinc-900 focus:bg-zinc-900 py-3"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-sm line-clamp-1">{blog.title}</span>
                                        <span className="text-[10px] text-zinc-500 flex items-center gap-2">
                                            <FileText className="h-3 w-3" /> {blog.focus_keyword}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}

                    <SelectGroup>
                        <SelectLabel className="text-zinc-500 px-3 py-2 border-b border-zinc-900 flex items-center gap-1.5">
                            <LinkIcon className="h-3.5 w-3.5" /> Existing Library
                        </SelectLabel>
                        {blogs.filter(b => b.internal_links_count > 0).map(blog => (
                            <SelectItem
                                key={blog.id}
                                value={blog.id}
                                className="hover:bg-zinc-900 focus:bg-zinc-900 py-3"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium text-sm line-clamp-1">{blog.title}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                                            <FileText className="h-2.5 w-2.5" /> {blog.focus_keyword}
                                        </span>
                                        <span className="text-[10px] text-accent flex items-center gap-1">
                                            <LinkIcon className="h-2.5 w-2.5" /> {blog.internal_links_count} links
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
