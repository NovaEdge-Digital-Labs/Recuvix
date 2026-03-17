import { ResearchTopic, ResearchHistory } from "@/lib/types/research";
import { SortOption } from "@/lib/research/topicSorter";
import { FilterOption } from "@/lib/research/topicFilter";
import { TopicCard } from "./TopicCard";
import { SortFilterBar } from "./SortFilterBar";
import { ResearchHistorySidebar } from "./ResearchHistory";
import { Button } from "@/components/ui/button";
import { Zap, Database, RotateCcw, Layout, Plus } from "lucide-react";

interface ResearchResultsViewProps {
    niche: string;
    topics: ResearchTopic[];
    isLoading: boolean;
    history: ResearchHistory[];
    sortBy: SortOption;
    filterBy: FilterOption;
    selectedCount: number;
    onSortChange: (val: SortOption) => void;
    onFilterChange: (val: FilterOption) => void;
    onSelect: (id: string) => void;
    onSelectAll: () => void;
    onGenerateNow: (topic: ResearchTopic) => void;
    onAddToTracker: (topic: ResearchTopic) => void;
    onAddToCalendar: (topic: ResearchTopic) => void;
    onBulkGenerate: () => void;
    onFetchRealVolume: () => void;
    onLoadHistory: (item: ResearchHistory) => void;
    onDeleteHistory: (id: string) => void;
    onClearHistory: () => void;
    onReset: () => void;
}

export function ResearchResultsView(props: ResearchResultsViewProps) {
    const {
        niche, topics, isLoading, history, sortBy, filterBy, selectedCount,
        onSortChange, onFilterChange, onSelect, onSelectAll,
        onGenerateNow, onAddToTracker, onAddToCalendar, onBulkGenerate, onFetchRealVolume,
        onLoadHistory, onDeleteHistory, onClearHistory, onReset
    } = props;

    const allSelected = topics.length > 0 && topics.every(t => t.selected);

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700">
            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-card/30 p-6 rounded-2xl border border-border/50">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Researching Niche
                        </div>
                        <h2 className="text-3xl font-black text-white capitalize">
                            {niche}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReset}
                            className="h-9 border-border text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw size={14} className="mr-2" />
                            New Research
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={onFetchRealVolume}
                            className="h-9 bg-blue-600 text-white hover:bg-blue-700 font-bold"
                        >
                            <Database size={14} className="mr-2" />
                            Fetch Real Volume
                        </Button>
                    </div>
                </div>

                {/* Controls */}
                <SortFilterBar
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                    filterBy={filterBy}
                    onFilterChange={onFilterChange}
                />

                {/* Bulk Action Bar */}
                {topics.length > 0 && (
                    <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-xl p-3 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-background border border-border rounded-lg">
                                <span
                                    className="text-xs font-bold text-accent cursor-pointer hover:underline"
                                    onClick={onSelectAll}
                                >
                                    {allSelected ? "Deselect All" : "Select All"}
                                </span>
                                <span className="text-[10px] text-muted-foreground">|</span>
                                <span className="text-xs font-medium text-white">
                                    {selectedCount} selected
                                </span>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            disabled={selectedCount === 0}
                            onClick={onBulkGenerate}
                            className="bg-accent text-black font-black hover:bg-accent/90 disabled:opacity-50"
                        >
                            <Zap size={14} className="mr-2 fill-current" />
                            Bulk Generate Selected
                        </Button>
                    </div>
                )}

                {/* List of Topics */}
                <div className="space-y-3">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-20 bg-card/30 border border-border/30 rounded-xl animate-pulse" />
                        ))
                    ) : topics.length === 0 ? (
                        <div className="text-center py-20 bg-card/20 rounded-2xl border border-dashed border-border/50">
                            <Layout className="mx-auto text-muted-foreground mb-4 opacity-20" size={48} />
                            <p className="text-muted-foreground">No topics found for this filter.</p>
                        </div>
                    ) : (
                        topics.map((topic, index) => (
                            <TopicCard
                                key={topic.id}
                                topic={topic}
                                index={index}
                                onSelect={onSelect}
                                onGenerateNow={onGenerateNow}
                                onAddToTracker={onAddToTracker}
                                onAddToCalendar={onAddToCalendar}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
                <div className="sticky top-24 space-y-6">
                    <ResearchHistorySidebar
                        history={history}
                        onLoad={onLoadHistory}
                        onDelete={onDeleteHistory}
                        onClear={onClearHistory}
                    />

                    {/* Pro Tip Card */}
                    <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-blue-400">
                            <Plus size={14} />
                            <span className="text-[10px] uppercase tracking-wider font-extrabold">Pro Tip</span>
                        </div>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            Generating listicles first helps establish topical authority and provides internal linking opportunities for your deep-dive guides.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
