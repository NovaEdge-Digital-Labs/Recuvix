"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TitleSuggestion, TitleSuggestRequest } from "@/lib/validators/titleSchemas";
import { useAppContext } from "@/context/AppContext";

const CACHE_KEY = "recuvix_title_suggestion_cache";
const CACHE_MAX_ENTRIES = 20;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
    suggestions: TitleSuggestion[];
    country: string;
    cachedAt: string;
    model: string;
}

interface Cache {
    [key: string]: CacheEntry;
}

export function useTitleSuggestions() {
    const { apiConfig } = useAppContext();
    const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCached, setIsCached] = useState(false);
    const [lastTopic, setLastTopic] = useState("");
    const [usedAngles, setUsedAngles] = useState<string[]>([]);

    const abortControllerRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef(0);

    const getCacheKey = (topic: string, country: string) => {
        return `${topic.toLowerCase().trim()}_${country.toLowerCase().trim()}`;
    };

    const getCache = useCallback((): Cache => {
        try {
            const stored = localStorage.getItem(CACHE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }, []);

    const saveToCache = useCallback((key: string, entry: CacheEntry) => {
        try {
            const cache = getCache();
            cache[key] = entry;

            // Maintain LRU - simple version by timestamp
            const keys = Object.keys(cache);
            if (keys.length > CACHE_MAX_ENTRIES) {
                const oldestKey = keys.reduce((a, b) =>
                    new Date(cache[a].cachedAt) < new Date(cache[b].cachedAt) ? a : b
                );
                delete cache[oldestKey];
            }

            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (e) {
            console.error("Failed to save suggestions to cache", e);
        }
    }, [getCache]);

    const fetchSuggestions = useCallback(async (topic: string, country: string, avoidAngles: string[] = []) => {
        if (isLoading || topic.length < 5) return;

        const cacheKey = getCacheKey(topic, country);
        const cache = getCache();
        const cachedEntry = cache[cacheKey];

        // Check cache
        if (avoidAngles.length === 0 && cachedEntry) {
            const age = Date.now() - new Date(cachedEntry.cachedAt).getTime();
            if (age < CACHE_TTL_MS) {
                setSuggestions(cachedEntry.suggestions);
                setIsVisible(true);
                setIsCached(true);
                setLastTopic(topic);
                setError(null);
                return;
            }
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const thisRequestId = ++requestIdRef.current;

        setIsLoading(true);
        setIsVisible(true);
        setError(null);
        setIsCached(false);

        setIsCached(false);

        // If not in managed mode, we would want to check for an API key early.
        // However, we send the request to the server, and the server will reject it if
        // the user is not authenticated or out of credits.
        // We will just let the backend handle the API key missing error if applicable.

        try {
            const payload: TitleSuggestRequest = {
                llmProvider: apiConfig.selectedModel as any,
                apiKey: apiConfig.apiKey,
                topic,
                country,
                count: 5,
                avoidAngles: avoidAngles.length > 0 ? avoidAngles : undefined,
            };

            const res = await fetch("/api/titles/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                signal: abortControllerRef.current.signal,
            });

            if (thisRequestId !== requestIdRef.current) return;

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to fetch suggestions");
            }

            const data = await res.json();

            setSuggestions(data.suggestions);
            setLastTopic(topic);
            setIsLoading(false);

            // Save to cache if not a regeneration
            if (avoidAngles.length === 0) {
                saveToCache(cacheKey, {
                    suggestions: data.suggestions,
                    country,
                    cachedAt: new Date().toISOString(),
                    model: data.model,
                });
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            if (thisRequestId !== requestIdRef.current) return;

            setError(err.message || "Something went wrong");
            setIsLoading(false);
        }
    }, [apiConfig, isLoading, getCache, saveToCache]);

    const regenerate = useCallback(async (topic: string, country: string) => {
        const currentAngles = suggestions.map(s => s.angle);
        setUsedAngles(prev => Array.from(new Set([...prev, ...currentAngles])));

        // Clear cache for this specific topic+country before regenerating
        try {
            const cache = getCache();
            delete cache[getCacheKey(topic, country)];
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch { }

        await fetchSuggestions(topic, country, currentAngles);
    }, [suggestions, fetchSuggestions, getCache]);

    const dismiss = useCallback(() => {
        setIsVisible(false);
    }, []);

    const toggleVisible = useCallback(() => {
        setIsVisible(prev => !prev);
    }, []);

    const reset = useCallback(() => {
        setSuggestions([]);
        setIsLoading(false);
        setIsVisible(false);
        setError(null);
        setIsCached(false);
        setUsedAngles([]);
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    const selectSuggestion = useCallback((suggestion: TitleSuggestion) => {
        setIsVisible(false);
        setUsedAngles(prev => Array.from(new Set([...prev, suggestion.angle])));
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        suggestions,
        isLoading,
        isVisible,
        error,
        isCached,
        lastTopic,
        fetchSuggestions,
        regenerate,
        selectSuggestion,
        dismiss,
        toggleVisible,
        reset,
    };
}
