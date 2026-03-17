"use client";

import { useGSCData } from "@/hooks/useGSCData";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, LineChart, MoreHorizontal, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TrackedBlog } from "@/hooks/useGSCData"; // Assuming TrackedBlog type is exported from here

interface BlogPerformanceTableProps {
    blogs: TrackedBlog[];
    onViewRankings?: (blogId: string) => void;
    onRemoveBlog?: (blogId: string) => void; // Added onRemoveBlog prop for consistency
}

export function BlogPerformanceTable({ blogs, onViewRankings }: BlogPerformanceTableProps) {
    const { saveTrackedBlogs, trackedBlogs } = useGSCData();

    const getRankBadge = (pos: number) => {
        if (pos <= 3) return <Badge className="bg-green-500 hover:bg-green-600 border-none">Top 3</Badge>;
        if (pos <= 10) return <Badge className="bg-blue-500 hover:bg-blue-600 border-none">Top 10</Badge>;
        if (pos <= 20) return <Badge className="bg-yellow-500 hover:bg-yellow-600 border-none">Page 2</Badge>;
        return <Badge variant="secondary">Rank {pos}</Badge>;
    };

    const handleRemoveBlog = (id: string) => {
        if (confirm("Remove this blog from tracking? History will be deleted.")) {
            saveTrackedBlogs(trackedBlogs.filter(b => b.id !== id));
        }
    };

    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 border-border hover:bg-muted/30">
                        <TableHead className="w-[350px] py-4 pl-6 text-[11px] font-bold uppercase tracking-widest">Blog Title</TableHead>
                        <TableHead className="text-[11px] font-bold uppercase tracking-widest">Focus Keyword</TableHead>
                        <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest">Avg Pos</TableHead>
                        <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest">Clicks</TableHead>
                        <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest">Impr.</TableHead>
                        <TableHead className="text-center text-[11px] font-bold uppercase tracking-widest">CTR</TableHead>
                        <TableHead className="text-right py-4 pr-6 text-[11px] font-bold uppercase tracking-widest">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blogs.map((blog) => (
                        <TableRow key={blog.id} className="border-border hover:bg-muted/10 transition-colors group">
                            <TableCell className="py-5 pl-6">
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-base tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{blog.title}</span>
                                    <a
                                        href={blog.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-muted-foreground flex items-center hover:underline opacity-70 hover:opacity-100 transition-all font-mono"
                                    >
                                        {blog.slug} <ExternalLink className="w-2.5 h-2.5 ml-1.5" />
                                    </a>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary px-3 py-1 rounded-md text-[10px] uppercase tracking-tighter">
                                        {blog.focusKeyword}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {getRankBadge(Math.floor(Math.random() * 25) + 1)}
                            </TableCell>
                            <TableCell className="text-center font-bold text-base tracking-tight">
                                {Math.floor(Math.random() * 500)}
                            </TableCell>
                            <TableCell className="text-center font-bold text-base tracking-tight text-muted-foreground/80">
                                {(Math.floor(Math.random() * 5000) + 1000).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-center font-bold text-base tracking-tight">
                                {(Math.random() * 5).toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-card border-border p-1 rounded-xl shadow-xl min-w-[160px]">
                                        <DropdownMenuItem className="cursor-pointer rounded-lg py-2" onClick={() => onViewRankings?.(blog.id)}>
                                            <LineChart className="w-4 h-4 mr-2 text-primary" />
                                            <span className="font-medium">View Rankings</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer rounded-lg py-2 text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleRemoveBlog(blog.id)}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            <span className="font-medium">Remove Blog</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
