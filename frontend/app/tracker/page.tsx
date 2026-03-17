"use client";

import { useState } from "react";
import { NavBar } from "@/components/navigation/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGSCData } from "@/hooks/useGSCData";
import { Loader2 } from "lucide-react";

// Placeholder components for tabs - will be implemented next
import { TrackerOverview } from "@/components/tracker/TrackerOverview";
import { BlogRegistry } from "@/components/tracker/BlogRegistry";
import { RankingsView } from "@/components/tracker/RankingsView";
import { OpportunitiesView } from "@/components/tracker/OpportunitiesView";
import { GscConnectCard } from "@/components/tracker/GscConnectCard";
import { GscStatusBar } from "@/components/tracker/GscStatusBar";

export default function TrackerPage() {
    const { isConnected, isHydrated, gscConfig, disconnectGSC, trackedBlogs } = useGSCData();
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedBlogId, setSelectedBlogId] = useState<string>("");

    // Initialize selected blog when blogs load if not already set
    if (trackedBlogs.length > 0 && !selectedBlogId && activeTab === "rankings") {
        setSelectedBlogId(trackedBlogs[0].id);
    }

    const handleViewRankings = (blogId: string) => {
        setSelectedBlogId(blogId);
        setActiveTab("rankings");
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Blog Performance Tracker
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Monitor your rankings, impressions, and clicks with real-time Google Search Console data.
                        </p>
                    </div>

                    {isConnected && gscConfig && (
                        <div className="shrink-0">
                            <GscStatusBar
                                siteUrl={gscConfig.siteUrl}
                                onDisconnect={disconnectGSC}
                            />
                        </div>
                    )}
                </header>

                {!isConnected ? (
                    <div className="flex items-center justify-center py-12">
                        <GscConnectCard />
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full">
                        <TabsList className="flex border-b border-white/10 mb-8 w-full justify-start bg-transparent rounded-none p-0 h-auto gap-0 border-x-0 border-t-0">
                            <TabsTrigger
                                value="overview"
                                className="px-6 py-4 text-sm font-bold cursor-pointer border-b-2 transition-all rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-[#e8ff47] data-[state=active]:text-[#e8ff47] data-[state=inactive]:border-transparent data-[state=inactive]:text-white/50 data-[state=inactive]:hover:text-white/80 data-[state=active]:shadow-none h-full"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="blogs"
                                className="px-6 py-4 text-sm font-bold cursor-pointer border-b-2 transition-all rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-[#e8ff47] data-[state=active]:text-[#e8ff47] data-[state=inactive]:border-transparent data-[state=inactive]:text-white/50 data-[state=inactive]:hover:text-white/80 data-[state=active]:shadow-none h-full"
                            >
                                My Blogs
                            </TabsTrigger>
                            <TabsTrigger
                                value="rankings"
                                className="px-6 py-4 text-sm font-bold cursor-pointer border-b-2 transition-all rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-[#e8ff47] data-[state=active]:text-[#e8ff47] data-[state=inactive]:border-transparent data-[state=inactive]:text-white/50 data-[state=inactive]:hover:text-white/80 data-[state=active]:shadow-none h-full"
                            >
                                Rankings
                            </TabsTrigger>
                            <TabsTrigger
                                value="opportunities"
                                className="px-6 py-4 text-sm font-bold cursor-pointer border-b-2 transition-all rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-[#e8ff47] data-[state=active]:text-[#e8ff47] data-[state=inactive]:border-transparent data-[state=inactive]:text-white/50 data-[state=inactive]:hover:text-white/80 data-[state=active]:shadow-none h-full"
                            >
                                Opportunities
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-0 outline-none w-full">
                            <TrackerOverview onViewRankings={handleViewRankings} />
                        </TabsContent>

                        <TabsContent value="blogs" className="mt-0 outline-none w-full">
                            <BlogRegistry />
                        </TabsContent>

                        <TabsContent value="rankings" className="mt-0 outline-none w-full">
                            <RankingsView
                                selectedBlogId={selectedBlogId}
                                onBlogChange={setSelectedBlogId}
                            />
                        </TabsContent>

                        <TabsContent value="opportunities" className="mt-0 outline-none w-full">
                            <OpportunitiesView />
                        </TabsContent>
                    </Tabs>
                )}
            </main>
        </div>
    );
}
