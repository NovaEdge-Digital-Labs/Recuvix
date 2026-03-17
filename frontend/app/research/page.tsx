"use client";

import { useKeywordResearch } from "@/hooks/useKeywordResearch";
import { useBulkGeneration, BulkOptions } from "@/hooks/useBulkGeneration";
import { useCalendar } from "@/hooks/useCalendar";
import { useGSCData } from "@/hooks/useGSCData";
import { ResearchInput } from "@/components/research/ResearchInput";
import { ResearchResultsView } from "@/components/research/ResearchResultsView";
import { BulkGenerateModal } from "@/components/research/BulkGenerateModal";
import { NavBar } from "@/components/navigation/NavBar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ResearchTopic } from "@/lib/types/research";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ResearchPage() {
    const router = useRouter();
    const {
        phase, topics, isLoading, history, sortBy, filterBy, selectedCount,
        research, setSortBy, setFilterBy,
        selectTopic, selectAll, fetchRealVolume,
        loadFromHistory, deleteFromHistory, clearHistory, resetToInput,
        lastQuery, error
    } = useKeywordResearch();

    const { createEntry } = useCalendar();
    const { importBlogs } = useGSCData();
    const [lastSearchParams, setLastSearchParams] = useState<{ niche: string; country: string } | null>(null);

    const niche = lastQuery?.niche || "";

    // Show toast on error
    useEffect(() => {
        if (phase === "error" && error) {
            const isRateLimit = error.toLowerCase().includes("rate limit");
            const isInvalidKey = error.toLowerCase().includes("invalid api key");
            toast.error(
                isRateLimit
                    ? "Rate limit reached — your API provider is throttling requests. Wait a moment and try again."
                    : isInvalidKey
                        ? "Invalid API key. Please check your settings."
                        : `Research failed: ${error}`,
                { duration: 6000 }
            );
        }
    }, [phase, error]);

    const handleSearch = (niche: string, country: string) => {
        setLastSearchParams({ niche, country });
        research({
            niche,
            country,
            contentGoal: "traffic",
            difficulty: "all"
        });
    };

    const handleRetry = () => {
        if (lastSearchParams) {
            research({
                niche: lastSearchParams.niche,
                country: lastSearchParams.country,
                contentGoal: "traffic",
                difficulty: "all"
            });
        }
    };

    const {
        queue, isRunning, currentIndex, completedCount, failedCount,
        startQueue, cancelQueue, downloadAll
    } = useBulkGeneration();

    const onGenerateNow = (topic: ResearchTopic) => {
        const params = new URLSearchParams({
            topic: topic.title,
            keyword: topic.focusKeyword,
        });
        router.push(`/?${params.toString()}`);
    };

    const onAddToTracker = (topic: ResearchTopic) => {
        importBlogs([{
            title: topic.title,
            url: "https://yourblog.com/" + topic.focusKeyword.toLowerCase().replace(/\s+/g, '-'),
            slug: topic.focusKeyword.toLowerCase().replace(/\s+/g, '-'),
            focusKeyword: topic.focusKeyword,
            secondaryKeywords: [topic.title],
            publishedAt: new Date().toISOString()
        }]);
        toast.success("Topic added to Performance Tracker");
    };

    const onAddToCalendar = async (topic: ResearchTopic) => {
        try {
            await createEntry({
                title: topic.title,
                topic: topic.angle,
                focus_keyword: topic.focusKeyword,
                status: 'planned',
                priority: 'medium',
                scheduled_date: new Date().toISOString().split('T')[0], // Default to today
            });
            toast.success("Topic scheduled in Content Calendar");
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleBulkStart = (options: BulkOptions) => {
        const selectedTopics = topics.filter(t => t.selected);
        startQueue(selectedTopics, options);
    };

    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />
            <main className="flex-1 pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-12">
                {(phase === "input" || phase === "error") && !niche ? (
                    <div className="py-20 animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-6">
                        <ResearchInput
                            onSearch={handleSearch}
                            isLoading={isLoading}
                        />
                        {phase === "error" && error && (
                            <div className="max-w-3xl mx-auto mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
                                <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-destructive">Research failed</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
                                </div>
                                {lastSearchParams && (
                                    <button
                                        onClick={handleRetry}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors shrink-0"
                                    >
                                        <RefreshCw size={13} />
                                        Retry
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <ResearchResultsView
                        niche={niche}
                        topics={topics}
                        isLoading={isLoading}
                        history={history}
                        sortBy={sortBy}
                        filterBy={filterBy}
                        selectedCount={selectedCount}
                        onSortChange={setSortBy}
                        onFilterChange={setFilterBy}
                        onSelect={selectTopic}
                        onSelectAll={selectAll}
                        onGenerateNow={onGenerateNow}
                        onAddToTracker={onAddToTracker}
                        onAddToCalendar={onAddToCalendar}
                        onBulkGenerate={() => setIsBulkModalOpen(true)}
                        onFetchRealVolume={fetchRealVolume}
                        onLoadHistory={loadFromHistory}
                        onDeleteHistory={deleteFromHistory}
                        onClearHistory={clearHistory}
                        onReset={resetToInput}
                    />
                )}

                <BulkGenerateModal
                    isOpen={isBulkModalOpen}
                    onClose={() => setIsBulkModalOpen(false)}
                    selectedCount={selectedCount}
                    isRunning={isRunning}
                    queue={queue}
                    completedCount={completedCount}
                    failedCount={failedCount}
                    currentIndex={currentIndex}
                    onStart={handleBulkStart}
                    onCancel={cancelQueue}
                    onDownload={downloadAll}
                />
            </main>
        </div>
    );
}

