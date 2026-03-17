"use client";

import { useGSCData } from "@/hooks/useGSCData";
import { SummaryStatCard } from "./SummaryStatCard";
import { BlogPerformanceTable } from "./BlogPerformanceTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";

import { GscImportModal } from "./GscImportModal";
import { useState } from "react";

interface TrackerOverviewProps {
    onViewRankings?: (blogId: string) => void;
}

export function TrackerOverview({ onViewRankings }: TrackerOverviewProps) {
    const { trackedBlogs } = useGSCData();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const hasBlogs = trackedBlogs.length > 0;

    if (!hasBlogs) {
        return (
            <>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold mb-2">No blogs tracked yet</h2>
                    <p className="text-muted-foreground max-w-sm mb-8">
                        Add your first blog to start tracking its keyword rankings, impressions, and clicks.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="rounded-full px-8">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Add Your First Blog
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-8 border-primary/30 hover:border-primary text-primary"
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            <Search className="mr-2 h-5 w-5" />
                            Import from Search Console
                        </Button>
                    </div>
                </div>
                <GscImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                />
            </>
        );
    }

    return (
        <div className="space-y-12">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryStatCard
                    title="Total Clicks"
                    value="1,284"
                    trend={12}
                    period="last 28 days"
                />
                <SummaryStatCard
                    title="Total Impressions"
                    value="45,920"
                    trend={8.4}
                    period="last 28 days"
                />
                <SummaryStatCard
                    title="Avg. Position"
                    value="14.2"
                    trend={-2.1}
                    trendIsGood={true}
                    period="last 28 days"
                />
                <SummaryStatCard
                    title="Avg. CTR"
                    value="2.8%"
                    trend={0.4}
                    period="last 28 days"
                />
            </div>

            {/* Blog Table */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h2 className="text-2xl font-heading font-bold tracking-tight">Blog Performance</h2>
                        <p className="text-muted-foreground text-sm mt-1">Real-time search metrics for your tracked assets.</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/30 px-3 py-1.5 rounded-md">
                        <Search className="w-3 h-3" />
                        Data lag: ~3 days (GSC standard)
                    </div>
                </div>
                <BlogPerformanceTable blogs={trackedBlogs} onViewRankings={onViewRankings} />
            </section>
        </div>
    );
}
