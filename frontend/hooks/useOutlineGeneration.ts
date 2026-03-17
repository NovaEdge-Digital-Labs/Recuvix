"use client";

import { useState, useCallback } from "react";
import { OutlineResponse, ApprovedOutline, H2Item } from "@/lib/types/outline";
import { nanoid } from "nanoid";
import { useAppContext } from "@/context/AppContext";

interface GenerationInput {
    topic: string;
    country: string;
    tone: string;
    wordCount: number;
    focusKeyword?: string;
    secondaryKeywords?: string[];
    angle?: string;
}

export function useOutlineGeneration() {
    const { apiConfig } = useAppContext();
    const [outline, setOutline] = useState<OutlineResponse | null>(null);
    const [outlineHistory, setOutlineHistory] = useState<OutlineResponse[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastRemovedH2, setLastRemovedH2] = useState<{ item: H2Item; index: number } | null>(null);

    const callOutlineAPI = useCallback(async (params: object): Promise<OutlineResponse> => {
        const response = await fetch("/api/outline/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(data.error || `HTTP ${response.status}`);
        }
        return response.json();
    }, []);

    const generateOutline = useCallback(async (input: GenerationInput) => {
        if (!apiConfig.selectedModel) {
            setError("No AI model selected. Please choose a model.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setOutlineHistory([]);
        setHistoryIndex(-1);

        try {
            const result = await callOutlineAPI({
                llmProvider: apiConfig.selectedModel,
                apiKey: apiConfig.apiKey,
                topic: input.topic,
                country: input.country,
                tone: input.tone,
                wordCount: input.wordCount,
                focusKeyword: input.focusKeyword,
                secondaryKeywords: input.secondaryKeywords || [],
                angle: input.angle,
            });
            setOutline(result);
            setIsVisible(true);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to generate outline";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [apiConfig, callOutlineAPI]);

    const regenerateOutline = useCallback(async (note: string) => {
        if (!outline || !apiConfig.selectedModel) return;
        setIsLoading(true);
        setError(null);

        // Push current to history (max 3)
        setOutlineHistory(prev => {
            const next = [...prev, outline].slice(-3);
            setHistoryIndex(next.length - 1);
            return next;
        });

        try {
            const result = await callOutlineAPI({
                llmProvider: apiConfig.selectedModel,
                apiKey: apiConfig.apiKey,
                topic: outline.h1,
                country: "Same as before",
                tone: "Same",
                wordCount: outline.h2s.length > 7 ? 2500 : outline.h2s.length > 5 ? 1500 : 800,
                existingH2s: outline.h2s.map(h => h.text),
                regenerationNote: note || undefined,
                focusKeyword: outline.focusKeyword,
            });
            setOutline(result);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Regeneration failed";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [outline, apiConfig, callOutlineAPI]);

    const updateH1 = useCallback((newH1: string) => {
        setOutline(prev => prev ? { ...prev, h1: newH1 } : prev);
    }, []);

    const updateH2 = useCallback((id: string, newText: string) => {
        setOutline(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                h2s: prev.h2s.map(h => h.id === id ? { ...h, text: newText, locked: true } : h),
            };
        });
    }, []);

    const addH2 = useCallback(() => {
        const newItem: H2Item = { id: nanoid(), text: "", locked: false };
        setOutline(prev => prev ? { ...prev, h2s: [...prev.h2s, newItem] } : prev);
        return newItem.id;
    }, []);

    const removeH2 = useCallback((id: string) => {
        setOutline(prev => {
            if (!prev) return prev;
            const index = prev.h2s.findIndex(h => h.id === id);
            if (index === -1) return prev;
            setLastRemovedH2({ item: prev.h2s[index], index });
            return { ...prev, h2s: prev.h2s.filter(h => h.id !== id) };
        });
    }, []);

    const restoreH2 = useCallback(() => {
        if (!lastRemovedH2) return;
        setOutline(prev => {
            if (!prev) return prev;
            const newH2s = [...prev.h2s];
            newH2s.splice(lastRemovedH2.index, 0, lastRemovedH2.item);
            return { ...prev, h2s: newH2s };
        });
        setLastRemovedH2(null);
    }, [lastRemovedH2]);

    const reorderH2s = useCallback((newOrder: string[]) => {
        setOutline(prev => {
            if (!prev) return prev;
            const reordered = newOrder
                .map(id => prev.h2s.find(h => h.id === id))
                .filter((h): h is H2Item => Boolean(h));
            return { ...prev, h2s: reordered };
        });
    }, []);

    const lockH2 = useCallback((id: string) => {
        setOutline(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                h2s: prev.h2s.map(h => h.id === id ? { ...h, locked: true } : h),
            };
        });
    }, []);

    const navigateHistory = useCallback((direction: "back" | "forward") => {
        setHistoryIndex(prev => {
            const next = direction === "back" ? prev - 1 : prev + 1;
            if (next < 0 || next >= outlineHistory.length) return prev;
            setOutline(outlineHistory[next]);
            return next;
        });
    }, [outlineHistory]);

    const approveOutline = useCallback((): ApprovedOutline => {
        if (!outline) throw new Error("No outline to approve");
        return {
            h1: outline.h1,
            h2s: outline.h2s.map(h => h.text),
            focusKeyword: outline.focusKeyword,
        };
    }, [outline]);

    const closePanel = useCallback(() => setIsVisible(false), []);
    const openPanel = useCallback(() => setIsVisible(true), []);
    const clearError = useCallback(() => setError(null), []);

    return {
        outline,
        outlineHistory,
        historyIndex,
        isLoading,
        isVisible,
        error,
        generateOutline,
        regenerateOutline,
        updateH1,
        updateH2,
        addH2,
        removeH2,
        restoreH2,
        reorderH2s,
        lockH2,
        navigateHistory,
        approveOutline,
        closePanel,
        openPanel,
        clearError,
    };
}
