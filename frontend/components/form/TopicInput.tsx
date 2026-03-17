"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Check } from "lucide-react";
import { useTitleSuggestions } from "@/hooks/useTitleSuggestions";
import { TitleSuggestions } from "./TitleSuggestions";
import { TitleSuggestion } from "@/lib/validators/titleSchemas";
import { cn } from "@/lib/utils";

interface TopicInputProps {
    value: string;
    onChange: (value: string) => void;
    country: string;
    onFocusKeywordChange?: (keyword: string) => void;
    mode?: "title" | "topic";
    placeholder?: string;
    className?: string;
}

export function TopicInput({
    value,
    onChange,
    country,
    onFocusKeywordChange,
    mode = "title",
    placeholder = "e.g., The Future of React Actions in Next.js 14",
    className,
}: TopicInputProps) {
    const suggestions = useTitleSuggestions();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (value.length < 10 && suggestions.isVisible) {
            suggestions.reset();
        }
    }, [value, suggestions]);

    // Reset suggestions if country changes while visible
    useEffect(() => {
        if (suggestions.isVisible) {
            suggestions.reset();
        }
    }, [country, suggestions]);

    const handleSelect = useCallback((suggestion: TitleSuggestion) => {
        onChange(suggestion.title);

        if (onFocusKeywordChange) {
            onFocusKeywordChange(suggestion.focusKeyword);
        }

        // Save to localStorage for research prefill as per requirements
        localStorage.setItem('recuvix_research_prefill', JSON.stringify({ focusKeyword: suggestion.focusKeyword }));

        suggestions.selectSuggestion(suggestion);

        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);

        inputRef.current?.focus();
    }, [onChange, onFocusKeywordChange, suggestions]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && suggestions.isVisible) {
            suggestions.dismiss();
            e.stopPropagation();
        }
    };

    const isSuggestVisible = value.length >= 5;

    return (
        <div className={cn("space-y-0", className)}>
            <div className="relative group">
                <Textarea
                    ref={inputRef}
                    placeholder={placeholder}
                    className="resize-none h-24 bg-background pr-24 transition-all focus:border-accent/40"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* Suggest Button */}
                {isSuggestVisible && !showConfirmation && (
                    <button
                        type="button"
                        onClick={() => {
                            if (suggestions.isVisible) {
                                suggestions.dismiss();
                            } else {
                                suggestions.fetchSuggestions(value, country);
                            }
                        }}
                        disabled={suggestions.isLoading}
                        className={cn(
                            "absolute right-3 top-3 px-2 py-1.5 h-8 rounded-md bg-accent text-black text-[11px] font-bold uppercase tracking-wider transition-all hover:bg-accent/80 active:scale-95 flex items-center gap-1.5 z-10",
                            suggestions.isLoading && "opacity-80"
                        )}
                    >
                        {suggestions.isLoading ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            <Sparkles size={13} />
                        )}
                        <span className="hidden md:inline">{suggestions.isLoading ? "Thinking..." : "Suggest"}</span>
                    </button>
                )}

                {/* Character Counter (if needed, simplified for now) */}
                <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground font-mono bg-background/50 px-1.5 py-0.5 rounded pointer-events-none">
                    {value.length}
                </div>
            </div>

            {/* Suggestions Panel */}
            <TitleSuggestions
                suggestions={suggestions.suggestions}
                isLoading={suggestions.isLoading}
                isVisible={suggestions.isVisible}
                error={suggestions.error}
                isCached={suggestions.isCached}
                mode={mode}
                onSelect={handleSelect}
                onRegenerate={() => suggestions.regenerate(value, country)}
                onDismiss={suggestions.dismiss}
            />

            {/* Confirmation Message */}
            {showConfirmation && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-500 animate-in fade-in slide-in-from-top-1">
                    <Check size={14} />
                    <span>Title applied — feel free to edit it further</span>
                </div>
            )}
        </div>
    );
}
