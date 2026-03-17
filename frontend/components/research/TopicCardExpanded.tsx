import { ResearchTopic } from "@/lib/types/research";
import { TopicMetricsGrid } from "./TopicMetricsGrid";
import { Button } from "@/components/ui/button";
import { Zap, Target, Globe, Plus, Calendar } from "lucide-react";

interface TopicCardExpandedProps {
    topic: ResearchTopic;
    onGenerateNow: (topic: ResearchTopic) => void;
    onAddToTracker: (topic: ResearchTopic) => void;
    onAddToCalendar: (topic: ResearchTopic) => void;
}

export function TopicCardExpanded({ topic, onGenerateNow, onAddToTracker, onAddToCalendar }: TopicCardExpandedProps) {
    return (
        <div className="mt-6 space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Keywords Section */}
            <div className="flex flex-wrap gap-8">
                <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Focus Keyword</span>
                    <div>
                        <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-bold border border-accent/20">
                            {topic.focusKeyword}
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Secondary Keywords</span>
                    <div className="flex flex-wrap gap-2">
                        {topic.secondaryKeywords.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 bg-card border border-border rounded-md text-xs text-muted-foreground font-medium">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <TopicMetricsGrid
                volume={topic.searchVolumeRange}
                difficulty={topic.difficulty}
                score={topic.difficultyScore}
                intent={topic.intent}
                wordCount={topic.estimatedWordCount}
            />

            {/* Strategy Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                        <Zap size={14} />
                        <span className="text-[10px] uppercase tracking-wider font-bold">The Unique Angle</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed bg-accent/5 p-4 rounded-xl border border-accent/10 italic">
                        &ldquo;{topic.angle}&rdquo;
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                        <Target size={14} />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Why it will rank</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                        {topic.whyItWillRank}
                    </p>
                </div>
            </div>

            {/* Country Relevance */}
            <div className="p-4 bg-muted/30 border border-border rounded-xl flex items-start gap-3">
                <Globe size={18} className="text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Target Market Context</span>
                    <p className="text-sm text-muted-foreground">
                        &quot;Why this topic matters in {topic.countryRelevance}&quot;
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
                <Button
                    onClick={() => onGenerateNow(topic)}
                    className="bg-accent text-black font-bold hover:bg-accent/90"
                >
                    <Zap size={16} className="mr-2 fill-current" />
                    Generate Blog Now
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onAddToTracker(topic)}
                    className="border-border hover:bg-card"
                >
                    <Plus size={16} className="mr-2" />
                    Add to Tracker
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onAddToCalendar(topic)}
                    className="hover:bg-card text-accent border-accent/20 hover:border-accent/40"
                >
                    <Calendar size={16} className="mr-2" />
                    Schedule
                </Button>
            </div>
        </div>
    );
}
