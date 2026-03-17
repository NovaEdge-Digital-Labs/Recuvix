"use client";

import { cn } from "@/lib/utils";

export function TitleSuggestionSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-24 w-full bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-4 animate-pulse",
                        "flex flex-col gap-3"
                    )}
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    <div className="flex gap-2">
                        <div className="h-4 w-16 bg-[#1a1a1a] rounded-full" />
                        <div className="h-4 w-20 bg-[#1a1a1a] rounded-full" />
                    </div>
                    <div className="h-5 bg-[#1a1a1a] rounded w-[85%]" />
                    <div className="h-4 bg-[#1a1a1a] rounded w-[60%]" />
                </div>
            ))}
            <p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
                Generating suggestions...
            </p>
        </div>
    );
}
