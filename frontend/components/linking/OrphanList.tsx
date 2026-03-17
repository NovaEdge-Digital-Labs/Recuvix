import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, Link2Off } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OrphanListProps {
    orphans: any[];
    onAnalyse: (id: string) => void;
}

export function OrphanList({ orphans, onAnalyse }: OrphanListProps) {
    if (orphans.length === 0) {
        return (
            <Card className="border-zinc-800 bg-zinc-950 p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Link2Off className="h-6 w-6 text-green-500 opacity-40 shrink-0" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-zinc-100 font-bold italic">No Orphan Blogs Found</h3>
                    <p className="text-sm text-zinc-500 max-w-sm">
                        Excellent! Every blog in your library is either linking out or receiving links.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-bold text-zinc-100">Unlinked Blogs ({orphans.length})</h3>
                <p className="text-xs text-zinc-500 ml-2">These blogs are isolated and provide zero SEO juice.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orphans.map((blog) => (
                    <Card key={blog.blog_id} className="border-zinc-800 bg-zinc-950 p-4 flex items-center justify-between group">
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-zinc-200 group-hover:text-accent transition-colors">
                                {blog.title}
                            </h4>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] bg-zinc-900 border-zinc-800 text-zinc-500">
                                    {blog.focus_keyword}
                                </Badge>
                                <span className="text-[10px] text-zinc-600">
                                    {blog.inbound_links} in · {blog.outbound_links} out
                                </span>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-800 text-zinc-400 group-hover:border-accent group-hover:text-accent"
                            onClick={() => onAnalyse(blog.blog_id)}
                        >
                            Analyse <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
