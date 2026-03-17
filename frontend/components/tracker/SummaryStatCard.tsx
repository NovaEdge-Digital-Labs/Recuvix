"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryStatCardProps {
    title: string;
    value: string | number;
    trend: number;
    trendIsGood?: boolean; // defaults to trend > 0 is good
    period: string;
}

export function SummaryStatCard({ title, value, trend, trendIsGood, period }: SummaryStatCardProps) {
    const isPositive = trend > 0;
    // For position, a negative trend (lower number) is good. 
    // Otherwise, a positive trend (higher clicks/ups) is good.
    const isGood = trendIsGood !== undefined ? trendIsGood : isPositive;

    return (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-heading font-bold">{value}</h3>
                <div className={cn(
                    "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
                    isGood ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic">{period}</p>
        </div>
    );
}
