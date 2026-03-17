"use client";

import { Check, X, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionAcceptBarProps {
    onAccept: () => void;
    onDiscard: () => void;
    onRetry?: () => void;
    isStreaming: boolean;
}

export function SectionAcceptBar({ onAccept, onDiscard, onRetry, isStreaming }: SectionAcceptBarProps) {
    return (
        <div className="sticky bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <div className="bg-surface-lighter border border-border rounded-xl shadow-2xl p-2 flex items-center gap-2 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
                <div className="px-3 py-1 flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-foreground">AI Revision</p>
                    <p className="text-[9px] text-muted-foreground">Review changes before accepting</p>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDiscard}
                    disabled={isStreaming}
                    className="h-9 px-3 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-400"
                >
                    <X size={14} className="mr-2" />
                    Discard
                </Button>

                {onRetry && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRetry}
                        disabled={isStreaming}
                        className="h-9 px-3 text-xs text-muted-foreground hover:bg-surface-lighter"
                    >
                        <RefreshCcw size={14} className="mr-2" />
                        Retry
                    </Button>
                )}

                <Button
                    size="sm"
                    onClick={onAccept}
                    disabled={isStreaming}
                    className="h-9 px-4 text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                >
                    <Check size={14} className="mr-2" />
                    Accept Changes
                </Button>
            </div>
        </div>
    );
}
