import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScoreBreakdown } from '@/lib/linking/linkingEngine';

interface ScoreBreakdownBarProps {
    breakdown: ScoreBreakdown;
    className?: string;
}

export function ScoreBreakdownBar({ breakdown, className }: ScoreBreakdownBarProps) {
    const items = [
        { label: 'KW', score: breakdown.keywordOverlap, max: 40, color: 'bg-accent' },
        { label: 'Topic', score: breakdown.topicSimilarity, max: 30, color: 'bg-blue-500' },
        { label: 'Country', score: breakdown.countryMatch, max: 15, color: 'bg-green-500' },
        { label: 'Fresh', score: breakdown.contentFreshness, max: 10, color: 'bg-yellow-500' },
        { label: 'New', score: breakdown.notAlreadyLinked, max: 5, color: 'bg-purple-500' },
    ];

    return (
        <TooltipProvider>
            <div className={`flex gap-1 h-1.5 w-full max-w-[200px] ${className}`}>
                {items.map((item) => (
                    <Tooltip key={item.label}>
                        <TooltipTrigger {...({ asChild: true } as any)}>
                            <div
                                className={`h-full rounded-full ${item.color} opacity-60 hover:opacity-100 transition-opacity`}
                                style={{ width: `${(item.score / 100) * 100}%`, minWidth: item.score > 0 ? '4px' : '0px' }}
                            />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs bg-black text-white border-zinc-800">
                            <p>{item.label}: {item.score}/{item.max}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}
