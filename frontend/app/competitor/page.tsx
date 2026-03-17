"use client";

import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/navigation/NavBar';
import { useCompetitorAnalysis } from '@/hooks/useCompetitorAnalysis';
import { CompetitorInput } from '@/components/competitor/CompetitorInput';
import { CompetitorProgress } from '@/components/competitor/CompetitorProgress';
import { CompetitorResults } from '@/components/competitor/CompetitorResults';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CompetitorPage() {
    const router = useRouter();
    const { apiConfig, isHydrated } = useAppContext();
    const {
        phase,
        scrapeData,
        analysis,
        brief,
        history,
        error,
        analyze,
        cancel,
        loadFromHistory,
        deleteFromHistory,
        updateBriefSection,
        resetToInput
    } = useCompetitorAnalysis();

    const [lastUsedCountry, setLastUsedCountry] = useState('US');

    // Redirect to onboarding if no API key
    useEffect(() => {
        if (isHydrated && !apiConfig.apiKey) {
            router.push("/onboarding");
        }
    }, [apiConfig.apiKey, isHydrated, router]);

    const handleAnalyze = (url: string, country: string, niche?: string) => {
        if (!apiConfig.apiKey || !apiConfig.selectedModel) {
            toast.error("API configuration missing. Please check your settings.");
            return;
        }
        setLastUsedCountry(country);
        analyze(url, apiConfig.apiKey, apiConfig.selectedModel, country, niche);
    };

    const handleGenerate = () => {
        if (!scrapeData || !brief) return;

        // Construct the pending task data
        const pendingTask = {
            topic: brief.superiorTitle,
            country: lastUsedCountry,
            tone: "Professional", // Default if AppContext doesn't have it
            wordCount: brief.targetWordCount,
            targetAudience: "General Reader",
            isCompetitorBrief: true
        };

        const approvedOutline = {
            h1: brief.superiorTitle,
            h2s: brief.outline.map((s: { id: string; h2: string; instructions: string }) => ({
                id: s.id,
                text: s.h2,
                instruction: s.instructions
            })),
            focusKeyword: brief.focusKeyword,
            secondaryKeywords: brief.secondaryKeywords,
            generatedAt: new Date().toISOString(),
            generationInput: pendingTask,
            competitorContext: {
                url: scrapeData.url,
                summary: brief.winStrategy,
                uniqueAngles: brief.uniqueAngles,
                avoid: brief.avoidList
            }
        };

        localStorage.setItem("recuvix_approved_outline", JSON.stringify(approvedOutline));
        localStorage.setItem("recuvix_pending_task", JSON.stringify(pendingTask));

        toast.success("Brief transferred! Starting superior blog generation...");

        // Redirect to generating page
        setTimeout(() => {
            router.push("/generating");
        }, 500);
    };

    if (!isHydrated) return <div className="min-h-screen bg-background" />;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-1">
                {phase === 'input' && (
                    <CompetitorInput
                        onAnalyze={handleAnalyze}
                        history={history}
                        onLoadHistory={loadFromHistory}
                        onDeleteHistory={deleteFromHistory}
                        isLoading={false}
                    />
                )}

                {phase === 'scraping' && (
                    <CompetitorProgress
                        url={scrapeData?.url || ''}
                        currentStep={1}
                        onCancel={cancel}
                    />
                )}

                {phase === 'analyzing' && (
                    <CompetitorProgress
                        url={scrapeData?.url || ''}
                        currentStep={3}
                        onCancel={cancel}
                    />
                )}

                {phase === 'briefing' && (
                    <CompetitorProgress
                        url={scrapeData?.url || ''}
                        currentStep={4}
                        onCancel={cancel}
                    />
                )}

                {phase === 'complete' && scrapeData && analysis && brief && (
                    <CompetitorResults
                        data={scrapeData}
                        analysis={analysis}
                        brief={brief}
                        onReset={resetToInput}
                        onGenerate={handleGenerate}
                        onUpdateBrief={updateBriefSection}
                    />
                )}

                {phase === 'error' && (
                    <div className="max-w-md mx-auto py-20 px-4 text-center">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
                        <p className="text-slate-500 text-sm mb-8">{error || "An unexpected error occurred while analyzing the page."}</p>
                        <button
                            onClick={resetToInput}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Try Another URL
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
