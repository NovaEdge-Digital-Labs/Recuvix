import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown, CheckCircle2, ChevronRight, Globe } from "lucide-react";
import { LanguageQueueItem } from "@/hooks/useMultilingualGeneration";
import { HreflangPack } from "./HreflangPack";

interface AllCompletePanelProps {
    queue: LanguageQueueItem[];
    hreflangPack: string;
    onDownloadAll: () => void;
}

export function AllCompletePanel({ queue, hreflangPack, onDownloadAll }: AllCompletePanelProps) {
    const completedItems = queue.filter(i => i.status === "complete");

    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border-2 border-primary/20 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Celebration Header */}
            <div className="p-8 bg-primary/5 border-b space-y-4 text-center">
                <div className="flex justify-center">
                    <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-2xl border-2 border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight underline decoration-primary underline-offset-4">Generation Complete</h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        All {completedItems.length} language versions were successfully natively localized.
                    </p>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Main Action */}
                <div className="space-y-4">
                    <Button
                        className="w-full h-14 text-base font-black uppercase tracking-widest gap-3 shadow-primary/20 shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
                        onClick={onDownloadAll}
                    >
                        <FileDown className="w-5 h-5" />
                        Download Multilingual ZIP
                    </Button>
                    <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                        Includes HTML, Markdown, SEO Meta, and Hreflang Tags for all versions
                    </p>
                </div>

                {/* Individual Summary */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generated Versions</h3>
                        <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded-full">{completedItems.length}</span>
                    </div>

                    <div className="space-y-2">
                        {completedItems.map((item) => (
                            <div
                                key={item.language.code}
                                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border hover:bg-muted/50 transition-colors group cursor-default"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.language.flag}</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-none">{item.language.name}</span>
                                        <span className="text-[9px] text-muted-foreground uppercase font-black mt-1">
                                            {item.wordCount} words • SEO Validated
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Ready</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hreflang Pack Component */}
                {hreflangPack && <HreflangPack htmlContent={hreflangPack} />}
            </div>

            <div className="p-4 bg-muted/20 border-t flex items-center justify-center gap-2">
                <Globe className="w-4 h-4 text-primary opacity-50" />
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                    Rank globally with native-level localization
                </span>
            </div>
        </div>
    );
}
