import { useState } from "react";
import { ResearchTopic } from "@/lib/types/research";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { DifficultyBadge } from "./DifficultyBadge";
import { TrafficDots } from "./TrafficDots";
import { SearchVolumeBar } from "./SearchVolumeBar";
import { ContentTypeBadge } from "./ContentTypeBadge";
import { TopicCardExpanded } from "./TopicCardExpanded";

interface TopicCardProps {
    topic: ResearchTopic;
    index: number;
    onSelect: (id: string) => void;
    onGenerateNow: (topic: ResearchTopic) => void;
    onAddToTracker: (topic: ResearchTopic) => void;
    onAddToCalendar: (topic: ResearchTopic) => void;
}

export function TopicCard({ topic, index, onSelect, onGenerateNow, onAddToTracker, onAddToCalendar }: TopicCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={cn(
            "group bg-card border border-border rounded-xl transition-all duration-300 overflow-hidden",
            topic.selected && "border-l-[3px] border-l-accent shadow-[0_0_20px_rgba(232,255,71,0.05)] bg-[#1a1a1a]",
            !topic.selected && "hover:border-border/80"
        )}>
            {/* Header Content (Collapsed State) */}
            <div
                className="p-5 flex items-center gap-4 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {/* Selection Checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                        checked={topic.selected}
                        onCheckedChange={() => onSelect(topic.id)}
                        className="w-5 h-5 border-2 border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-black"
                    />
                </div>

                {/* Index Number */}
                <span className="text-xs font-mono text-muted-foreground w-6">
                    {(index + 1).toString().padStart(2, '0')}
                </span>

                {/* Title and Badges */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-accent transition-colors">
                            {topic.title}
                        </h3>

                        <div className="flex items-center gap-3">
                            <ContentTypeBadge type={topic.contentType} />

                            <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">
                                <BarChart3 size={12} className="text-accent" />
                                <span>{topic.searchVolumeRange}</span>
                                <SearchVolumeBar range={topic.searchVolumeRange} className="w-12 ml-1" />
                            </div>

                            <DifficultyBadge
                                difficulty={topic.difficulty}
                                score={topic.difficultyScore}
                                className="hidden sm:inline-flex"
                            />

                            <TrafficDots
                                potential={topic.estimatedTrafficPotential}
                                className="hidden lg:flex"
                            />
                        </div>
                    </div>
                </div>

                {/* Toggle Icon */}
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-5 pb-6 border-t border-border/50 bg-[#0c0c0c]">
                    <TopicCardExpanded
                        topic={topic}
                        onGenerateNow={onGenerateNow}
                        onAddToTracker={onAddToTracker}
                        onAddToCalendar={onAddToCalendar}
                    />
                </div>
            )}
        </div>
    );
}
