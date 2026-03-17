"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Globe, ChevronRight, Zap, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { countryLocaleMap } from "@/lib/utils/countryLocaleMap";
import { cn } from "@/lib/utils";
import { useTitleSuggestions } from "@/hooks/useTitleSuggestions";
import { TitleSuggestions } from "@/components/form/TitleSuggestions";
import { TitleSuggestion } from "@/lib/validators/titleSchemas";

interface ResearchInputProps {
    onSearch: (niche: string, country: string) => void;
    isLoading: boolean;
}

export function ResearchInput({ onSearch, isLoading }: ResearchInputProps) {
    const searchParams = useSearchParams();
    const [niche, setNiche] = useState("");
    const [country, setCountry] = useState("United States");
    const titleSuggestions = useTitleSuggestions();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const queryNiche = searchParams.get("niche");
        if (queryNiche) {
            setNiche(queryNiche);
        }
    }, [searchParams]);

    useEffect(() => {
        if (niche.length < 10 && titleSuggestions.isVisible) {
            titleSuggestions.reset();
        }
    }, [niche, titleSuggestions]);

    const countries = Object.keys(countryLocaleMap).sort();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (niche.trim() && !isLoading) {
            onSearch(niche.trim(), country);
            titleSuggestions.dismiss();
        }
    };

    const handleSelect = (suggestion: TitleSuggestion) => {
        setNiche(suggestion.title);
        // Also pre-fill research_prefill for other components if they use it
        localStorage.setItem('recuvix_research_prefill', JSON.stringify({ focusKeyword: suggestion.focusKeyword }));
        titleSuggestions.selectSuggestion(suggestion);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in duration-500">
                    <Zap size={12} className="fill-current" />
                    Keyword Research Mode
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    Find high-traffic <span className="text-accent italic">topic gaps</span> in seconds.
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Enter your niche and target market. We&apos;ll find low-competition, high-demand content opportunities for your blog.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative group p-2 bg-[#1a1a1a] border border-border/50 rounded-2xl shadow-2xl focus-within:border-accent/30 focus-within:shadow-[0_0_30px_rgba(232,255,71,0.05)] transition-all duration-500"
            >
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                    <div className="flex-1 relative flex items-center px-4 gap-3 bg-background/30 rounded-xl border border-border/20 focus-within:border-accent/20 transition-all">
                        <Search className="text-muted-foreground shrink-0" size={20} />
                        <Input
                            placeholder="e.g. Digital Nomads in Bali, Vegan BBQ Recipes&hellip;"
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape' && titleSuggestions.isVisible) {
                                    titleSuggestions.dismiss();
                                    e.stopPropagation();
                                }
                            }}
                            className="h-14 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground/60 text-lg pr-24"
                        />

                        {niche.length >= 5 && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (titleSuggestions.isVisible) {
                                        titleSuggestions.dismiss();
                                    } else {
                                        titleSuggestions.fetchSuggestions(niche, country);
                                    }
                                }}
                                disabled={titleSuggestions.isLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1.5 h-8 rounded-md bg-accent text-black text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-accent/80 active:scale-95 flex items-center gap-1.5 z-10"
                            >
                                {titleSuggestions.isLoading ? (
                                    <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <Sparkles size={13} />
                                )}
                                <span className="hidden md:inline">{titleSuggestions.isLoading ? "..." : "Suggest"}</span>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-background/30 rounded-xl border border-border/20 p-1">
                        <div className="flex items-center px-3 gap-2 border-r border-border/20">
                            <Globe size={18} className="text-muted-foreground" />
                        </div>
                        <Select value={country} onValueChange={(val) => { if (val) setCountry(val); }}>
                            <SelectTrigger className="w-full md:w-[160px] h-12 bg-transparent border-none focus:ring-0 text-foreground font-medium">
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border max-h-[300px]">
                                {countries.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !niche.trim()}
                        className={cn(
                            "h-14 px-8 rounded-xl bg-accent text-black font-black text-lg hover:bg-accent/90 transition-all active:scale-95 shadow-lg shadow-accent/10 whitespace-nowrap",
                            isLoading && "opacity-80"
                        )}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span>Analyzing...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Discover Topics</span>
                                <ChevronRight size={20} />
                            </div>
                        )}
                    </Button>
                </div>
            </form>

            <TitleSuggestions
                suggestions={titleSuggestions.suggestions}
                isLoading={titleSuggestions.isLoading}
                isVisible={titleSuggestions.isVisible}
                error={titleSuggestions.error}
                isCached={titleSuggestions.isCached}
                mode="topic"
                onSelect={handleSelect}
                onRegenerate={() => titleSuggestions.regenerate(niche, country)}
                onDismiss={titleSuggestions.dismiss}
                className="mt-4"
            />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="text-xs text-muted-foreground/60 uppercase tracking-widest font-bold self-center mr-2">Try searching:</span>
                {["SaaS Marketing", "Indoor Gardening", "Cybersecurity Trends"].map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => setNiche(tag)}
                        className="px-4 py-2 rounded-full bg-card border border-border text-xs text-muted-foreground hover:border-accent/30 hover:text-accent transition-all"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
