"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApprovedOutline } from "@/lib/types/outline";

interface OutlineFooterProps {
    wordCount: number;
    h2Count: number;
    focusKeyword: string;
    fromResearch: boolean;
    onConfirm: () => void;
    onClose: () => void;
    approveOutline: () => ApprovedOutline;
}

export function OutlineFooter({
    wordCount,
    h2Count,
    focusKeyword,
    fromResearch,
    onConfirm,
}: OutlineFooterProps) {
    return (
        <div className="flex items-center justify-between gap-4 pt-2">
            {/* Left: meta info */}
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-muted-foreground truncate">
                    ~{wordCount} words across {h2Count} sections
                </span>
                {focusKeyword && (
                    <span className="text-xs text-muted-foreground/60 truncate">
                        Focus: <span className="text-muted-foreground">{focusKeyword}</span>
                    </span>
                )}
                <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                    {fromResearch ? "From Research" : "AI Estimate"}
                </span>
            </div>

            {/* Right: CTAs */}
            <div className="flex items-center gap-2 shrink-0">
                <Button
                    onClick={onConfirm}
                    className="h-12 min-w-[180px] gap-2 bg-accent text-accent-foreground font-bold text-sm hover:bg-accent/90 shadow-[0_0_20px_rgba(232,255,71,0.2)] hover:shadow-[0_0_30px_rgba(232,255,71,0.35)] transition-all"
                >
                    Generate Full Blog
                    <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    );
}
