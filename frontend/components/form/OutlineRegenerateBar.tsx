"use client";

import { useState, useRef } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OutlineRegenerateBarProps {
    isRegenerating: boolean;
    hasHistory: boolean;
    regenerationError: string | null;
    onRegenerate: (note: string) => void;
}

export function OutlineRegenerateBar({
    isRegenerating,
    hasHistory,
    regenerationError,
    onRegenerate,
}: OutlineRegenerateBarProps) {
    const [note, setNote] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleRegenerate = () => {
        onRegenerate(note.trim());
    };

    return (
        <div className="space-y-3">
            <p className="text-[13px] text-muted-foreground">
                {hasHistory ? "Want to try a different structure?" : "Not what you expected?"}
            </p>

            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !isRegenerating) handleRegenerate(); }}
                    placeholder="Tell the AI what to change... e.g. 'more beginner-friendly' or 'focus on cost-saving tips'"
                    className="flex-1 h-10 px-3 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 disabled:opacity-50"
                    disabled={isRegenerating}
                />
                <Button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    variant="outline"
                    size="sm"
                    className="h-10 px-4 gap-2 border-border text-muted-foreground hover:text-foreground hover:border-accent/50 shrink-0"
                >
                    {isRegenerating ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <RefreshCw size={14} />
                    )}
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                </Button>
            </div>

            {regenerationError && (
                <p className="text-xs text-destructive">
                    {regenerationError} — your current outline is unchanged.
                </p>
            )}
        </div>
    );
}
