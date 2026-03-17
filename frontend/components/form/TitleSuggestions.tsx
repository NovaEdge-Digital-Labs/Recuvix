"use client";

import { useEffect, useState, useRef } from "react";
import { TitleSuggestion } from "@/lib/validators/titleSchemas";
import { TitleSuggestionCard } from "./TitleSuggestionCard";
import { TitleSuggestionSkeleton } from "./TitleSuggestionSkeleton";
import { RefreshCw, X, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TitleSuggestionsProps {
    suggestions: TitleSuggestion[];
    isLoading: boolean;
    isVisible: boolean;
    error: string | null;
    isCached?: boolean;
    mode?: "title" | "topic";
    onSelect: (suggestion: TitleSuggestion) => void;
    onRegenerate: () => void;
    onDismiss: () => void;
    className?: string;
}

export function TitleSuggestions({
    suggestions,
    isLoading,
    isVisible,
    error,
    isCached,
    mode = "title",
    onSelect,
    onRegenerate,
    onDismiss,
    className,
}: TitleSuggestionsProps) {
    const [shouldRender, setShouldRender] = useState(isVisible);
    const [animationState, setAnimationState] = useState(isVisible ? "open" : "closed");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setTimeout(() => setAnimationState("open"), 10);
        } else {
            setAnimationState("closed");
            const timer = setTimeout(() => setShouldRender(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!shouldRender) return null;

    return (
        <div
            role="listbox"
            aria-label={`${mode === "title" ? "Title" : "Topic"} suggestions`}
            className={cn(
                "w-full bg-[#111111] border-x border-b border-[#2a2a2a] rounded-b-xl overflow-hidden transition-all duration-200 ease-in-out z-50",
                animationState === "open" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                className
            )}
        >
            <div className="p-4 border-t border-[#333]">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-accent uppercase tracking-[0.12em]">
                            {mode === "title" ? "Title Suggestions" : "Topic Ideas"}
                        </span>
                        {!isLoading && suggestions.length > 0 && (
                            <span className="bg-[#1a1a1a] text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-sm">
                                ({suggestions.length})
                            </span>
                        )}
                        {isCached && !isLoading && (
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" title="Loaded from cache" />
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!isLoading && !error && (
                            <button
                                onClick={onRegenerate}
                                className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-white transition-colors"
                            >
                                <RefreshCw size={12} />
                                Regenerate
                            </button>
                        )}
                        <button
                            onClick={onDismiss}
                            className="text-muted-foreground hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div ref={scrollRef} className="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {isLoading ? (
                        <TitleSuggestionSkeleton />
                    ) : error ? (
                        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                                <AlertCircle size={20} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-white">
                                    {error === "no_key" ? "API Key Missing" : "Generation Failed"}
                                </p>
                                <p className="text-xs text-muted-foreground max-w-[200px]">
                                    {error === "no_key"
                                        ? "Add your AI key in settings to unlock smart suggestions."
                                        : error}
                                </p>
                            </div>
                            {error === "no_key" ? (
                                <button
                                    onClick={() => window.location.href = '/onboarding'}
                                    className="text-xs text-accent underline underline-offset-4 hover:no-underline font-medium"
                                >
                                    Configure API Keys →
                                </button>
                            ) : (
                                <button
                                    onClick={onRegenerate}
                                    className="px-4 py-1.5 bg-[#1a1a1a] border border-border rounded-lg text-xs font-medium hover:bg-[#222] transition-colors"
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="py-8 text-center space-y-2">
                            <Sparkles size={24} className="mx-auto text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground">Type a topic to get AI suggestions</p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {suggestions.map((s, i) => (
                                <TitleSuggestionCard
                                    key={s.id}
                                    suggestion={s}
                                    onSelect={onSelect}
                                    index={i}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
