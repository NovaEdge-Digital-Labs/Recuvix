import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    FileText,
    Globe,
    Hash,
    Link as LinkIcon,
    ExternalLink,
    RefreshCcw,
    Zap
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface BlogHeaderCardProps {
    blog: any;
    onAnalyse: (force?: boolean) => void;
    isAnalysing: boolean;
    lastAnalysedAt?: string | null;
}

export function BlogHeaderCard({ blog, onAnalyse, isAnalysing, lastAnalysedAt }: BlogHeaderCardProps) {
    if (!blog) return null;

    return (
        <Card className="border-zinc-800 bg-zinc-950/50 p-6 overflow-hidden relative group">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors duration-700" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-4 max-w-2xl">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {blog.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-800 flex gap-1.5 items-center">
                                <Hash className="h-3 w-3" /> {blog.focus_keyword}
                            </Badge>
                            {blog.country && (
                                <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-800 flex gap-1.5 items-center">
                                    <Globe className="h-3 w-3" /> {blog.country}
                                </Badge>
                            )}
                            <Badge variant="secondary" className="bg-zinc-900 text-zinc-400 border-zinc-800 flex gap-1.5 items-center">
                                <FileText className="h-3 w-3" /> {blog.word_count} words
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-zinc-500">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                                <LinkIcon className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                                <span className="block text-zinc-100 font-bold leading-none">{blog.internal_links_count || 0}</span>
                                <span className="text-[10px] uppercase font-semibold">Total Links</span>
                            </div>
                        </div>

                        {blog.slug && (
                            <a
                                href={`/blog/${blog.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-accent transition-colors"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>View Live</span>
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {lastAnalysedAt && (
                        <div className="text-[10px] uppercase font-bold text-zinc-600 text-right mr-2 block sm:hidden md:block">
                            Last Analysis: <br />
                            <span className="text-zinc-400">{formatDistanceToNow(new Date(lastAnalysedAt))} ago</span>
                        </div>
                    )}

                    <Button
                        className="bg-accent text-zinc-950 hover:bg-accent/90 shadow-xl shadow-accent/5 flex gap-2 font-bold px-6"
                        onClick={() => onAnalyse(false)}
                        disabled={isAnalysing}
                    >
                        {isAnalysing ? (
                            <RefreshCcw className="h-4 w-4 animate-spin" />
                        ) : (
                            <Zap className="h-4 w-4" />
                        )}
                        {isAnalysing ? 'Analysing...' : 'Analyse Links'}
                    </Button>

                    {lastAnalysedAt && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                            onClick={() => onAnalyse(true)}
                            disabled={isAnalysing}
                            title="Force re-analyse library"
                        >
                            <RefreshCcw className={cn("h-4 w-4", isAnalysing && "animate-spin")} />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
