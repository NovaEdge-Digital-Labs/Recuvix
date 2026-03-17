"use client";

import { useGSCData } from "@/hooks/useGSCData";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Sparkles,
    Zap,
    ChevronRight,
    AlertCircle,
    Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function OpportunitiesView() {
    const { trackedBlogs, getSnapshots } = useGSCData();
    const router = useRouter();
    const [selectedBlogId, setSelectedBlogId] = useState<string>(trackedBlogs[0]?.id || "");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<unknown>(null);
    const [error, setError] = useState<string | null>(null);

    const selectedBlog = trackedBlogs.find(b => b.id === selectedBlogId);
    const snapshots = getSnapshots(selectedBlogId);

    const runAnalysis = async () => {
        if (!selectedBlog || snapshots.length === 0) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const configStr = localStorage.getItem("recuvix_api_config");
            if (!configStr) throw new Error("API credentials missing");
            const config = JSON.parse(configStr);

            // Calculate overall stats from current snapshots
            const totalClicks = snapshots.reduce((sum, s) => sum + s.clicks, 0);
            const totalImpressions = snapshots.reduce((sum, s) => sum + s.impressions, 0);
            const avgPosition = snapshots.reduce((sum, s) => sum + s.position, 0) / snapshots.length;
            const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;

            const payload = {
                llmProvider: config.llmProvider,
                apiKey: config.apiKey,
                blogTitle: selectedBlog.title,
                blogUrl: selectedBlog.url,
                focusKeyword: selectedBlog.focusKeyword || "N/A",
                topKeywords: snapshots.slice(0, 10).map(s => ({
                    keyword: s.keyword,
                    position: s.position,
                    impressions: s.impressions,
                    clicks: s.clicks,
                    ctr: s.ctr,
                    trend: "Stable" // Default trend for now
                })),
                overallStats: {
                    totalClicks,
                    totalImpressions,
                    avgCtr,
                    avgPosition,
                    dateRange: "Last 30 Days"
                },
                country: "Global"
            };

            const response = await fetch("/api/tracker/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Analysis failed");
            }

            const data = await response.json();
            setAnalysis(data); // The backend returns the full analysis object
        } catch (err: unknown) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Failed to generate suggestions.";
            setError(message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (trackedBlogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground">Add a blog in the &quot;My Blogs&quot; tab to start receiving AI opportunities.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Blog Selector */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border border-border p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="space-y-1.5 min-w-[240px] flex-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Analyze Blog</label>
                        <Select value={selectedBlogId} onValueChange={(val) => val && setSelectedBlogId(val)}>
                            <SelectTrigger className="bg-muted/30 border-border h-11">
                                <SelectValue placeholder="Select a blog" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                {trackedBlogs.map(blog => (
                                    <SelectItem key={blog.id} value={blog.id}>
                                        {blog.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    disabled={isAnalyzing || snapshots.length === 0}
                    onClick={runAnalysis}
                    size="lg"
                    className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 px-8 h-11"
                >
                    {isAnalyzing ? (
                        <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    ) : (
                        <Zap className="w-5 h-5 mr-2" />
                    )}
                    {isAnalyzing ? "Analyzing..." : "Get AI Suggestions"}
                </Button>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {!analysis && !isAnalyzing && (
                <div className="bg-card border border-border rounded-2xl p-20 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-2">Grow your rankings with AI</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Our AI will analyze your current GSC rankings and content to provide
                        specific optimization tips for headers, meta data, and internal linking.
                    </p>
                    {snapshots.length === 0 && (
                        <p className="text-orange-500 font-medium text-sm border border-orange-200 bg-orange-50 p-3 rounded-lg flex items-center gap-2 justify-center max-w-xs mx-auto">
                            <AlertCircle className="w-4 h-4" />
                            Need ranking data first.
                        </p>
                    )}
                </div>
            )}

            {isAnalyzing && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4 animate-pulse">
                            <div className="h-6 w-1/2 bg-muted rounded"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-muted rounded"></div>
                                <div className="h-4 w-3/4 bg-muted rounded"></div>
                            </div>
                            <div className="h-10 w-full bg-muted rounded-full"></div>
                        </div>
                    ))}
                </div>
            )}

            {analysis !== null && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(analysis as { suggestions: Array<{ type: string, impact: string, title: string, description: string, reasoning?: string, actions?: string[] }> }).suggestions?.map((item, idx: number) => (
                        <Card key={idx} className="bg-card border-border hover:border-primary/50 transition-colors shadow-sm overflow-hidden flex flex-col">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize px-2">
                                        {item.type}
                                    </Badge>
                                    <Badge variant="secondary" className="font-normal text-[10px] uppercase tracking-tighter">
                                        {item.impact} Impact
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-heading leading-tight">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-muted-foreground">{item.description}</p>

                                {item.reasoning && (
                                    <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs italic">
                                        <span className="font-medium text-foreground block mb-1">Why this works:</span>
                                        {item.reasoning}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-0 border-t border-border mt-4">
                                <div className="flex flex-col w-full pt-4 space-y-2">
                                    {item.actions?.map((action: string, aidx: number) => (
                                        <div key={aidx} className="flex items-start gap-2 text-xs text-foreground group">
                                            <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                                            {action}
                                        </div>
                                    ))}

                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 bg-muted/20 border-border hover:bg-muted/40 text-[10px] h-8 gap-1.5"
                                        onClick={() => router.push(`/research?niche=${encodeURIComponent(item.title)}`)}
                                    >
                                        <Search size={12} />
                                        Research This Topic
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
