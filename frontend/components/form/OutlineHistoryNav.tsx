"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface OutlineHistoryNavProps {
    currentIndex: number;
    totalVersions: number;
    onNavigate: (direction: "back" | "forward") => void;
}

export function OutlineHistoryNav({ currentIndex, totalVersions, onNavigate }: OutlineHistoryNavProps) {
    if (totalVersions < 1) return null;

    // currentIndex is the history array index; the "latest" is beyond the history
    const displayCurrent = currentIndex + 2; // 1-based: history items + current live outline
    const displayTotal = totalVersions + 1;

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button
                onClick={() => onNavigate("back")}
                disabled={currentIndex < 0}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous outline version"
            >
                <ChevronLeft size={14} />
            </button>
            <span>
                Outline <span className="text-foreground font-medium">{displayCurrent}</span> of {displayTotal}
            </span>
            <button
                onClick={() => onNavigate("forward")}
                disabled={currentIndex >= totalVersions - 1}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next outline version"
            >
                <ChevronRight size={14} />
            </button>
        </div>
    );
}
