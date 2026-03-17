"use client";

import { useGSCData } from "@/hooks/useGSCData";
import { useState, useMemo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PositionChart } from "./PositionChart";
import { KeywordsTable } from "./KeywordsTable";
import { RefreshCw, Download, Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

interface RankingsViewProps {
    selectedBlogId: string;
    onBlogChange: (blogId: string) => void;
}

export function RankingsView({ selectedBlogId, onBlogChange }: RankingsViewProps) {
    const { trackedBlogs, fetchLatestKeywords, getSnapshots, isLoading } = useGSCData();
    const [dateRange, setDateRange] = useState("28"); // days

    const selectedBlog = trackedBlogs.find(b => b.id === selectedBlogId);
    const snapshots = useMemo(() => getSnapshots(selectedBlogId), [selectedBlogId, getSnapshots]);

    const handleSync = async () => {
        if (!selectedBlogId) return;

        const endDate = new Date().toISOString().split("T")[0];
        const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

        await fetchLatestKeywords(selectedBlogId, startDate, endDate);
    };

    const handleExport = () => {
        // CSV export logic
        const headers = ["Keyword", "Position", "Impressions", "Clicks", "CTR", "Date"];
        const rows = snapshots.map(s => [
            s.keyword,
            s.position,
            s.impressions,
            s.clicks,
            s.ctr,
            s.date
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${selectedBlog?.slug || "blog"}-rankings.csv`);
        link.click();
    };

    if (trackedBlogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-muted-foreground">Add a blog in the &quot;My Blogs&quot; tab to start tracking rankings.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border border-border p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="space-y-1.5 min-w-[240px]">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Select Blog</label>
                        <Select value={selectedBlogId} onValueChange={(val) => val && onBlogChange(val)}>
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

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date Range</label>
                        <Select value={dateRange} onValueChange={(val) => val && setDateRange(val)}>
                            <SelectTrigger className="bg-muted/30 border-border h-11 w-[140px]">
                                <SelectValue placeholder="Past 28 days" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="7">Past 7 days</SelectItem>
                                <SelectItem value="28">Past 28 days</SelectItem>
                                <SelectItem value="90">Past 90 days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button variant="outline" size="lg" className="h-11 rounded-full px-6" onClick={handleSync} disabled={isLoading}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                                    {isLoading ? "Fetching..." : "Fetch Rankings"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs">
                                <p>Syncs latest performance data for the past 90 days from Google Search Console.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button variant="ghost" size="lg" className="h-11 rounded-full px-6" onClick={handleExport} disabled={snapshots.length === 0}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {snapshots.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-20 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold">No ranking snapshots yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                        Click &quot;Fetch Rankings&quot; to pull the latest ranking data for this blog from Google Search Console.
                    </p>
                    <Button onClick={handleSync} size="lg" className="rounded-full px-8" disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                        Fetch Data Now
                    </Button>
                </div>
            ) : (
                <>
                    {/* Main Ranking Chart */}
                    <div className="bg-card border border-border p-8 rounded-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-heading font-bold">Position History</h3>
                                <p className="text-sm text-muted-foreground mt-1">Average search position for your top keywords.</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full">
                                <Info className="w-3.5 h-3.5" />
                                GSC data is ~3 days delayed
                            </div>
                        </div>

                        <PositionChart snapshots={snapshots} focusKeyword={selectedBlog?.focusKeyword || ""} />
                    </div>

                    {/* Keywords Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-heading font-bold">Keyword Breakdown</h3>
                        <KeywordsTable snapshots={snapshots} />
                    </div>
                </>
            )}
        </div>
    );
}
