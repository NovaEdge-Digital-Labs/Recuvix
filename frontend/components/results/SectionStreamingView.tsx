"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Loader2 } from "lucide-react";

interface SectionStreamingViewProps {
    html: string;
    isStreaming: boolean;
}

export function SectionStreamingView({ html, isStreaming }: SectionStreamingViewProps) {
    return (
        <div className="relative group/stream border-2 border-accent/20 rounded-xl overflow-hidden bg-accent/[0.02] transition-colors">
            <div className="absolute top-0 right-0 p-3 flex items-center gap-2 z-10">
                <div className="px-2 py-1 rounded bg-accent/10 border border-accent/20 backdrop-blur-md flex items-center gap-2">
                    {isStreaming ? (
                        <Loader2 size={12} className="animate-spin text-accent" />
                    ) : (
                        <Sparkles size={12} className="text-accent" />
                    )}
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        {isStreaming ? "AI Rewriting..." : "AI Generated"}
                    </span>
                </div>
            </div>

            <div className="p-8 prose prose-invert prose-brand max-w-none">
                <div
                    className={cn(
                        "space-y-4 min-h-[100px]",
                        isStreaming && "after:content-['|'] after:inline-block after:animate-pulse after:ml-0.5 after:text-accent after:font-bold after:text-xl"
                    )}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>

            {isStreaming && (
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
            )}
        </div>
    );
}
