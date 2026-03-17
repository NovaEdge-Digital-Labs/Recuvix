"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BulkTopic, BulkSettings } from '@/lib/validators/bulkSchemas';
import { estimateBulkJob } from '@/lib/bulk/bulkEstimator';
import { Clock, Zap, Coins, FileText, BadgeInfo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BulkEstimatorCardProps {
    topics: BulkTopic[];
    settings: BulkSettings;
}

export function BulkEstimatorCard({ topics, settings }: BulkEstimatorCardProps) {
    const estimate = useMemo(() => estimateBulkJob(topics, settings), [topics, settings]);

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.ceil(seconds / 60);
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}h ${remainingMins}m`;
    };

    const getTimeColorSlots = () => {
        switch (estimate.timeLabel) {
            case 'Quick': return 'from-green-500/20 to-green-600/20 text-green-500';
            case 'Medium': return 'from-accent/20 to-accent/20 text-foreground';
            case 'Long run': return 'from-orange-500/20 to-orange-600/20 text-orange-500';
            case 'Overnight run': return 'from-red-500/20 to-red-600/20 text-red-500';
            default: return 'from-gray-500/20 to-gray-600/20 text-muted-foreground';
        }
    };

    return (
        <Card className="bg-background/60 border-border shadow-2xl relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20 ${getTimeColorSlots().split(' ').slice(0, 2).join(' ')}`} />

            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between uppercase tracking-wider text-muted-foreground">
                    Live Job Summary
                    <Badge variant="secondary" className={`text-[10px] font-bold ${getTimeColorSlots().split(' ').pop()}`}>
                        {estimate.timeLabel}
                    </Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Est. Time
                    </div>
                    <div className="text-xl font-black text-foreground">{formatTime(estimate.estimatedSeconds)}</div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        Total Words
                    </div>
                    <div className="text-xl font-black text-foreground">{estimate.estimatedWords.toLocaleString()}</div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3 text-foreground" />
                        API Calls
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger><BadgeInfo className="h-2 w-2 text-muted-foreground" /></TooltipTrigger>
                                <TooltipContent>Total sequential API requests to LLM and Image services.</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="text-xl font-black text-foreground">{estimate.estimatedApiCalls}</div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Coins className="h-3 w-3 text-green-500" />
                        Est. Cost
                    </div>
                    <div className="text-xl font-black text-foreground">${estimate.estimatedCostUsd.toFixed(2)}</div>
                </div>
            </CardContent>

            {topics.length > 0 && (
                <div className="px-6 pb-6 pt-2">
                    <div className="h-1.5 w-full bg-card rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(topics.length / 20) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Queue Density</span>
                        <span className="text-[10px] text-foreground font-bold">{Math.round((topics.length / 20) * 100)}%</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
