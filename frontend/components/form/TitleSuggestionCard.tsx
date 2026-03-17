"use client";

import { useState } from "react";
import { TitleSuggestion } from "@/lib/validators/titleSchemas";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TitleSuggestionCardProps {
    suggestion: TitleSuggestion;
    onSelect: (suggestion: TitleSuggestion) => void;
    index: number;
}

export function TitleSuggestionCard({ suggestion, onSelect }: TitleSuggestionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const charCount = suggestion.title.length;
    const getCharCountColor = (count: number) => {
        if (count >= 45 && count <= 65) return "text-green-500";
        if (count >= 35 && count < 45) return "text-yellow-500";
        return "text-red-500";
    };

    const getAngleStyles = (angle: string) => {
        const a = angle.toLowerCase();
        if (a.includes("listicle")) return "bg-[#1a0d2e] text-[#a78bfa]";
        if (a.includes("how-to")) return "bg-[#0d1e1a] text-[#34d399]";
        if (a.includes("ultimate")) return "bg-[#e8ff47] text-black font-bold";
        if (a.includes("comparison")) return "bg-[#0d1429] text-[#60a5fa]";
        if (a.includes("question")) return "bg-[#1e0d0d] text-[#f87171]";
        if (a.includes("case study")) return "bg-[#1e1400] text-[#fbbf24]";
        if (a.includes("beginner")) return "bg-[#0d1a0d] text-[#86efac]";
        if (a.includes("advanced")) return "bg-[#1e0d0d] text-[#f87171]";
        return "bg-[#1a1a1a] text-[#888]";
    };

    const getIntentStyles = (intent: string) => {
        const i = intent.toLowerCase();
        if (i === "informational") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
        if (i === "commercial") return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
        if (i === "transactional") return "bg-green-500/10 text-green-400 border border-green-500/20";
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    };

    const handleClick = () => {
        setIsSelected(true);
        setTimeout(() => {
            onSelect(suggestion);
        }, 150);
    };

    return (
        <div
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
            className={cn(
                "group relative bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg p-3.5 cursor-pointer transition-all duration-150",
                "hover:border-[#3a3a3a] hover:bg-[#141414] hover:translate-x-[2px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47]",
                isSelected && "border-[#e8ff47] bg-[#141e00] animate-[selectedFlash_200ms_ease]"
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono", getAngleStyles(suggestion.angle))}>
                        {suggestion.angle}
                    </span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full", getIntentStyles(suggestion.estimatedSearchIntent))}>
                        {suggestion.estimatedSearchIntent}
                    </span>
                </div>
                <span className={cn("text-[10px] font-mono", getCharCountColor(charCount))}>
                    {charCount}ch
                </span>
            </div>

            <h3 className="text-sm font-medium text-white leading-relaxed mb-3 pr-4 line-clamp-2">
                {suggestion.title}
            </h3>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">Focus:</span>
                    <span className="text-[11px] text-[#e8ff47] font-mono truncate max-w-[180px]">
                        {suggestion.focusKeyword}
                    </span>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-white transition-colors"
                >
                    Why it works {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border/20 text-[11px] text-muted-foreground animate-in slide-in-from-top-1 duration-200">
                    {suggestion.whyItWorks}
                </div>
            )}

            {/* Hover accent left border */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-[#e8ff47] group-hover:h-3/4 transition-all duration-200" />

            <style jsx global>{`
        @keyframes selectedFlash {
          0% { background: #141e00; border-color: #e8ff47; }
          50% { background: #1f2d00; border-color: #e8ff47; }
          100% { background: #141e00; border-color: #e8ff47; }
        }
      `}</style>
        </div>
    );
}
