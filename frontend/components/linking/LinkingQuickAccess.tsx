import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Network, Zap, ArrowRight, LinkIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LinkingQuickAccessProps {
    blogId: string;
}

export function LinkingQuickAccess({ blogId }: LinkingQuickAccessProps) {
    const [stats, setStats] = useState<{ suggestions: number, applied: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBriefStats() {
            try {
                const res = await fetch(`/api/linking/analyse`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ blogId })
                });

                if (!res.ok) {
                    const errText = await res.text();
                    throw new Error(`Analyse API failed: ${errText.substring(0, 50)}`);
                }
                const data = await res.json();

                // We also want to know how many are applied
                const graphRes = await fetch(`/api/linking/graph`);

                if (!graphRes.ok) {
                    const errText = await graphRes.text();
                    throw new Error(`Graph API failed: ${errText.substring(0, 50)}`);
                }
                const graphData = await graphRes.json();

                const blogNode = graphData.nodes?.find((n: any) => n.id === blogId);

                setStats({
                    suggestions: data.suggestions?.length || 0,
                    applied: blogNode ? (blogNode.inboundLinks + blogNode.outboundLinks) : 0
                });
            } catch (err) {
                console.error('Failed to fetch quick linking stats', err);
            } finally {
                setLoading(false);
            }
        }

        if (blogId) fetchBriefStats();
    }, [blogId]);

    if (loading) {
        return (
            <div className="animate-pulse flex items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <div className="h-8 w-8 rounded-lg bg-zinc-800" />
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-2/3 bg-zinc-800 rounded" />
                    <div className="h-2 w-1/2 bg-zinc-800 rounded" />
                </div>
            </div>
        );
    }

    const hasAnalysis = stats && (stats.suggestions > 0 || stats.applied > 0);

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                <Network size={18} className="text-accent" />
                Internal Links
            </h3>

            {!hasAnalysis ? (
                <div className="space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Connect this blog to your library. Find internal link opportunities across your other blogs.
                    </p>
                    <Link href={`/linking?blogId=${blogId}`}>
                        <Button className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                            <Zap className="mr-2" size={16} />
                            Analyse Now
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                            <span className="block text-xl font-black italic text-accent leading-none">
                                {stats?.suggestions || 0}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-zinc-500">Suggestions</span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                            <span className="block text-xl font-black italic text-zinc-100 leading-none">
                                {stats?.applied || 0}
                            </span>
                            <span className="text-[9px] uppercase font-bold text-zinc-500">Links Applied</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link href={`/linking?blogId=${blogId}`} className="w-full">
                            <Button variant="outline" className="w-full h-9 text-xs border-zinc-800 hover:bg-zinc-900 group">
                                View All Suggestions
                                <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/linking?tab=map" className="w-full">
                            <Button variant="ghost" className="w-full h-8 text-[10px] text-zinc-500 hover:text-accent group">
                                <Network className="mr-1.5 h-3 w-3" />
                                Open Library Map
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
