"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMultilingualGeneration } from "@/hooks/useMultilingualGeneration";
import { GenerationQueue } from "@/components/multilingual/GenerationQueue";
import { MultilingualPreview } from "@/components/multilingual/MultilingualPreview";
import { AllCompletePanel } from "@/components/multilingual/AllCompletePanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Globe, Share2, Sparkles, Languages } from "lucide-react";
import { FontLoader } from "@/components/multilingual/FontLoader";


export default function MultilingualPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {
        queue,
        activeLanguage,
        completedCount,
        totalCount,
        isRunning,
        isDone,
        selectedPreviewLanguage,
        hreflangPack,
        startGeneration,
        cancelAll,
        retryLanguage,
        setPreviewLanguage,
        downloadAll,
    } = useMultilingualGeneration();

    useEffect(() => {
        const topic = searchParams.get("topic");
        const languages = searchParams.get("languages")?.split(",") || [];
        const country = searchParams.get("country") || "us";
        const tone = searchParams.get("tone") || "professional";
        const wordCount = parseInt(searchParams.get("wordCount") || "1000");

        if (topic && languages.length > 0 && !isRunning && queue.length === 0 && !isDone) {
            startGeneration({
                topic,
                targetLanguages: languages,
                country,
                tone,
                wordCount,
            });
        }
    }, [searchParams, isRunning, queue.length, isDone, startGeneration]);

    return (
        <>
            <FontLoader />
            <div className="min-h-screen bg-background pb-20">
                {/* Header Ribbon */}
                <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-center gap-2 overflow-hidden relative">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Multilingual Deep-Localization Engine Active
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 -skew-x-12 translate-x-full animate-[shimmer_3s_infinite]" />
                </div>

                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
                    <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.back()}
                                className="rounded-full hover:bg-muted"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <Languages className="w-4 h-4 text-primary" />
                                    <h1 className="text-sm font-black uppercase tracking-widest">Multilingual Flow</h1>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[300px]">
                                    Topic: {searchParams.get("topic") || "New Blog Post"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                <Share2 className="w-3.5 h-3.5 mr-2" />
                                Live Link
                            </Button>
                            {isDone && (
                                <Button variant="default" size="sm" onClick={downloadAll} className="h-9 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">
                                    Export All
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="max-w-[1600px] mx-auto p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Queue & Status */}
                        <div className="lg:col-span-4 space-y-8">
                            {!isDone ? (
                                <GenerationQueue
                                    queue={queue}
                                    activeLanguage={activeLanguage}
                                    completedCount={completedCount}
                                    totalCount={totalCount}
                                    isRunning={isRunning}
                                    onCancel={cancelAll}
                                    onView={setPreviewLanguage}
                                    onRetry={retryLanguage}
                                />
                            ) : (
                                <AllCompletePanel
                                    queue={queue}
                                    hreflangPack={hreflangPack}
                                    onDownloadAll={downloadAll}
                                />
                            )}

                            {/* Tips / Context Card */}
                            <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Globe className="w-4 h-4" />
                                    <h3 className="text-xs font-bold uppercase tracking-widest">Global SEO Tips</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                                            <strong>Hreflang tags</strong> are critical. We&apos;ve generated them for you. Paste them in your CMS.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                                        <p className="text-[11px] leading-relaxed text-muted-foreground">
                                            Each version uses <strong>local market idioms</strong> and cultural nuances instead of verbatim translation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Dynamic Preview */}
                        <div className="lg:col-span-8">
                            <MultilingualPreview
                                queue={queue}
                                selectedCode={selectedPreviewLanguage}
                                onSelect={setPreviewLanguage}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
