interface MetricItemProps {
    label: string;
    value: string | number;
}

function MetricItem({ label, value }: MetricItemProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {label}
            </span>
            <span className="text-sm font-semibold text-foreground">
                {value}
            </span>
        </div>
    );
}

interface TopicMetricsGridProps {
    volume: string;
    difficulty: string;
    score: number;
    intent: string;
    wordCount: number;
}

export function TopicMetricsGrid({ volume, difficulty, score, intent, wordCount }: TopicMetricsGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-background/50 rounded-lg p-4 border border-border/50">
            <MetricItem label="Search Volume" value={volume} />
            <MetricItem label="Difficulty" value={`${difficulty} (${score})`} />
            <MetricItem label="Intent" value={intent} />
            <MetricItem label="Word Count" value={`~${wordCount.toLocaleString()}`} />
        </div>
    );
}
