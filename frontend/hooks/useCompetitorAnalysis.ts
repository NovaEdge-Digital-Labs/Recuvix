import { useState, useEffect, useCallback } from 'react';
import { ScrapedData, CompetitorAnalysis, CompetitorBrief } from '@/lib/services/competitorService';
import { nanoid } from 'nanoid';
import { getDomainName } from '@/lib/competitor/domainExtractor';

export type CompetitorPhase = "input" | "scraping" | "analyzing" | "briefing" | "complete" | "error";

export interface CompetitorHistoryItem {
    id: string;
    url: string;
    domain: string;
    pageTitle: string;
    analyzedAt: string;
    competitorScore: number;
    opportunityScore: number;
    brief: CompetitorBrief;
    scrapeData: ScrapedData;
    analysis: CompetitorAnalysis;
}

export function useCompetitorAnalysis() {
    const [phase, setPhase] = useState<CompetitorPhase>("input");
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
    const [scrapeData, setScrapeData] = useState<ScrapedData | null>(null);
    const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
    const [brief, setBrief] = useState<CompetitorBrief | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<CompetitorHistoryItem[]>([]);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    // Load history on mount
    useEffect(() => {
        const stored = localStorage.getItem("recuvix_competitor_history");
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse history:", e);
            }
        }
    }, []);

    const saveToHistory = useCallback((item: CompetitorHistoryItem) => {
        setHistory(prev => {
            const newHistory = [item, ...prev].slice(0, 10);
            localStorage.setItem("recuvix_competitor_history", JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    const analyze = async (url: string, apiKey: string, llmProvider: string, country: string, niche?: string) => {
        setError(null);
        const controller = new AbortController();
        setAbortController(controller);

        try {
            // Step 1: Scrape
            setPhase("scraping");
            setCurrentStep(1);

            const scrapeResp = await fetch("/api/competitor/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
                signal: controller.signal,
            });

            if (!scrapeResp.ok) {
                const data = await scrapeResp.json();
                throw new Error(data.error || "Failed to scrape page");
            }

            const { data: sData } = await scrapeResp.json();
            setScrapeData(sData);

            // Step 2 & 3: Analyze
            setPhase("analyzing");
            setCurrentStep(2);
            // Step 2... progressing to 3
            setTimeout(() => setCurrentStep(3), 2000);

            const analyzeResp = await fetch("/api/competitor/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    llmProvider,
                    apiKey,
                    scrapeData: sData,
                    targetCountry: country,
                    userNiche: niche,
                }),
                signal: controller.signal,
            });

            if (!analyzeResp.ok) {
                const data = await analyzeResp.json();
                throw new Error(data.error || "Failed to analyze content");
            }

            const { analysis: aData } = await analyzeResp.json();
            setAnalysis(aData);

            // Step 4: Brief
            setPhase("briefing");
            setCurrentStep(4);

            const briefResp = await fetch("/api/competitor/brief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    llmProvider,
                    apiKey,
                    scrapeData: sData,
                    analysis: aData,
                    targetCountry: country,
                }),
                signal: controller.signal,
            });

            if (!briefResp.ok) {
                const data = await briefResp.json();
                throw new Error(data.error || "Failed to generate brief");
            }

            const { brief: bData } = await briefResp.json();
            setBrief(bData);

            // Complete
            const historyItem: CompetitorHistoryItem = {
                id: nanoid(),
                url,
                domain: getDomainName(url),
                pageTitle: sData.title,
                analyzedAt: new Date().toISOString(),
                competitorScore: aData.competitorScore,
                opportunityScore: aData.opportunityScore,
                brief: bData,
                scrapeData: sData,
                analysis: aData,
            };

            saveToHistory(historyItem);
            setPhase("complete");

        } catch (e: any) {
            if (e.name === 'AbortError') {
                setPhase("input");
            } else {
                console.error("Analysis flow error:", e);
                setError(e.message || "An unexpected error occurred");
                setPhase("error");
            }
        } finally {
            setAbortController(null);
        }
    };

    const cancel = () => {
        if (abortController) {
            abortController.abort();
        }
    };

    const loadFromHistory = (id: string) => {
        const item = history.find(h => h.id === id);
        if (item) {
            setScrapeData(item.scrapeData);
            setAnalysis(item.analysis);
            setBrief(item.brief);
            setPhase("complete");
        }
    };

    const deleteFromHistory = (id: string) => {
        setHistory(prev => {
            const newHistory = prev.filter(h => h.id !== id);
            localStorage.setItem("recuvix_competitor_history", JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const updateBriefSection = (sectionId: string, h2: string) => {
        if (!brief) return;
        const newOutline = brief.outline.map(s => s.id === sectionId ? { ...s, h2 } : s);
        setBrief({ ...brief, outline: newOutline });
    };

    const resetToInput = () => {
        setPhase("input");
        setScrapeData(null);
        setAnalysis(null);
        setBrief(null);
        setError(null);
    };

    return {
        phase,
        currentStep,
        scrapeData,
        analysis,
        brief,
        isLoading: phase !== "input" && phase !== "complete" && phase !== "error",
        error,
        history,
        analyze,
        cancel,
        loadFromHistory,
        deleteFromHistory,
        updateBriefSection,
        resetToInput,
    };
}
