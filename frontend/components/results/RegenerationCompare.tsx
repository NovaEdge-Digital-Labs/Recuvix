"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RegenerationCompareProps {
    originalHtml: string;
    generatedHtml: string;
    isStreaming: boolean;
    onAccept: () => void;
    onDiscard: () => void;
}

export function RegenerationCompare({
    originalHtml,
    generatedHtml,
    isStreaming,
    onAccept,
    onDiscard
}: RegenerationCompareProps) {
    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
            <div className="h-16 border-b border-border flex items-center justify-between px-8 bg-surface/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                        <Sparkles size={16} className="text-accent" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground">Review Regenerated Blog</h2>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Comparison View</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isStreaming}
                        onClick={onDiscard}
                        className="text-xs text-red-400 hover:bg-red-500/10"
                    >
                        <X size={14} className="mr-2" />
                        Discard Changes
                    </Button>
                    <Button
                        size="sm"
                        disabled={isStreaming}
                        onClick={onAccept}
                        className="text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                    >
                        <Check size={14} className="mr-2" />
                        Apply Changes
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Original */}
                <div className="flex-1 flex flex-col border-r border-border bg-surface/20">
                    <div className="p-3 border-b border-border bg-surface/40 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Original Content</span>
                    </div>
                    <ScrollArea className="flex-1 p-12">
                        <article
                            className="prose prose-invert prose-brand max-w-none opacity-50"
                            dangerouslySetInnerHTML={{ __html: originalHtml }}
                        />
                    </ScrollArea>
                </div>

                {/* New */}
                <div className="flex-1 flex flex-col bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10">
                    <div className="p-3 border-b border-border bg-accent/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-accent uppercase">New AI Version</span>
                            {isStreaming && (
                                <div className="flex items-center gap-1.5 ml-2">
                                    <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                                    <span className="text-[9px] text-accent animate-pulse">Streaming content...</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-12">
                        <article
                            className={cn(
                                "prose prose-invert prose-brand max-w-none",
                                isStreaming && "after:content-['|'] after:inline-block after:animate-pulse after:ml-0.5 after:text-accent after:font-bold after:text-xl"
                            )}
                            dangerouslySetInnerHTML={{ __html: generatedHtml }}
                        />
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
