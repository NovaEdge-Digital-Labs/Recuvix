import { useState, useCallback, useEffect } from "react";
import { ResearchTopic, ResearchHistory } from "@/lib/types/research";
import { useAppContext } from "@/context/AppContext";
import {
    getResearchHistory,
    saveToHistory,
    deleteFromHistory as deleteHistoryItem
} from "@/lib/research/researchHistoryManager";
import { sortTopics, SortOption } from "@/lib/research/topicSorter";
import { filterTopics, FilterOption } from "@/lib/research/topicFilter";

export interface ResearchParams {
    niche: string;
    country: string;
    contentGoal: "traffic" | "leads" | "sales" | "awareness";
    difficulty: "all" | "easy_only" | "medium_and_below";
    existingTopics?: string[];
    count?: number;
}

export function useKeywordResearch() {
    const { apiConfig } = useAppContext();
    const [phase, setPhase] = useState<"input" | "loading" | "results" | "error">("input");
    const [topics, setTopics] = useState<ResearchTopic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastQuery, setLastQuery] = useState<{ niche: string; country: string } | null>(null);
    const [history, setHistory] = useState<ResearchHistory[]>([]);

    // UI State
    const [sortBy, setSortBy] = useState<SortOption>("relevance");
    const [filterBy, setFilterBy] = useState<FilterOption>("all");

    // Load history on mount
    useEffect(() => {
        setHistory(getResearchHistory());
    }, []);

    const research = useCallback(async (params: ResearchParams) => {
        if (!apiConfig.apiKey || !apiConfig.selectedModel) {
            setError("API key or model not configured");
            return;
        }

        setIsLoading(true);
        setPhase("loading");
        setError(null);

        try {
            const response = await fetch("/api/research/topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    llmProvider: apiConfig.selectedModel,
                    apiKey: apiConfig.apiKey,
                    ...params
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Research failed");
            }

            const newTopics = data.topics as ResearchTopic[];
            setTopics(newTopics);
            setLastQuery({ niche: params.niche, country: params.country });
            setPhase("results");

            // Save to history
            const historyItem: ResearchHistory = {
                id: Math.random().toString(36).substring(7),
                niche: params.niche,
                country: params.country,
                topics: newTopics,
                researchedAt: new Date().toISOString(),
                model: apiConfig.selectedModel
            };
            saveToHistory(historyItem);
            setHistory(getResearchHistory());

        } catch (err: any) {
            setError(err.message);
            setPhase("error");
        } finally {
            setIsLoading(false);
        }
    }, [apiConfig]);

    const selectTopic = useCallback((id: string) => {
        setTopics(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
    }, []);

    const selectAll = useCallback(() => {
        setTopics(prev => prev.map(t => ({ ...t, selected: true })));
    }, []);

    const deselectAll = useCallback(() => {
        setTopics(prev => prev.map(t => ({ ...t, selected: false })));
    }, []);

    const resetToInput = useCallback(() => {
        setPhase("input");
        setTopics([]);
        setError(null);
    }, []);

    const loadFromHistory = useCallback((historyItem: ResearchHistory) => {
        setTopics(historyItem.topics);
        setLastQuery({ niche: historyItem.niche, country: historyItem.country });
        setPhase("results");
    }, []);

    const deleteFromHistory = useCallback((id: string) => {
        deleteHistoryItem(id);
        setHistory(getResearchHistory());
    }, []);

    const clearHistory = useCallback(() => {
        localStorage.removeItem("recuvix_research_history");
        setHistory([]);
    }, []);

    const fetchRealVolume = useCallback(async () => {
        if (!apiConfig.apiKey || topics.length === 0) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/research/dataforseo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    keywords: topics.map(t => t.focusKeyword),
                    location: lastQuery?.country || "United States",
                    apiKey: apiConfig.apiKey
                }),
            });

            const data = await response.json();
            if (response.ok && data.results) {
                setTopics(prev => prev.map(t => {
                    const match = data.results.find((r: any) => r.keyword === t.focusKeyword);
                    if (match) {
                        return {
                            ...t,
                            searchVolumeRange: match.volume ? `${match.volume.toLocaleString()}/mo` : t.searchVolumeRange,
                            difficultyScore: match.difficulty || t.difficultyScore
                        };
                    }
                    return t;
                }));
            }
        } catch (err) {
            console.error("Failed to fetch real volume:", err);
        } finally {
            setIsLoading(false);
        }
    }, [apiConfig, topics, lastQuery]);

    const filteredAndSortedTopics = sortTopics(filterTopics(topics, filterBy), sortBy);

    return {
        phase,
        topics: filteredAndSortedTopics,
        rawTopics: topics,
        selectedTopics: topics.filter(t => t.selected),
        isLoading,
        error,
        lastQuery,
        research,
        selectTopic,
        selectAll,
        deselectAll,
        resetToInput,
        history,
        loadFromHistory,
        deleteFromHistory,
        clearHistory,
        sortBy,
        setSortBy,
        filterBy,
        setFilterBy,
        fetchRealVolume,
        selectedCount: topics.filter(t => t.selected).length
    };
}
