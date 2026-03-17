import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SuggestionScoreBadgeProps {
    score: number;
    className?: string;
}

export function SuggestionScoreBadge({ score, className }: SuggestionScoreBadgeProps) {
    const getColorClass = (s: number) => {
        if (s >= 80) return 'bg-green-500/10 text-green-500 border-green-500/20';
        if (s >= 60) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (s >= 40) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    };

    return (
        <Badge
            variant="outline"
            className={cn("font-mono font-bold", getColorClass(score), className)}
        >
            Score: {score}
        </Badge>
    );
}
