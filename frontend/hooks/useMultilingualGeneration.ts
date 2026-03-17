import { useState, useCallback, useRef, useEffect } from "react";
import { LanguageConfig, LANGUAGES } from "@/lib/config/languageConfig";
import { languageQueueManager, MultilingualSession, MultilingualVersion } from "@/lib/multilingual/languageQueueManager";
import { useAppContext } from "@/context/AppContext";
import { useStreamingLLM } from "./useStreamingLLM";
import { packageMultilingualZip } from "@/lib/multilingual/zipPackager";
import { generateHreflangHtml, generateHreflangJson } from "@/lib/multilingual/hreflangGenerator";
import { nanoid } from "nanoid";
import { marked } from "marked";

export interface LanguageQueueItem {
    language: LanguageConfig;
    status: "queued" | "generating" | "complete" | "failed";
    blogHtml: string;
    blogMarkdown: string;
    seoMeta: any | null;
    wordCount: number;
    streamedText: string;
    progress: number;
    error: string | null;
    startedAt: string | null;
    completedAt: string | null;
}

export interface MultilingualInput {
    topic: string;
    targetLanguages: string[];
    country: string;
    tone: string;
    wordCount: number;
    approvedOutline?: any;
    authorDetails?: any;
}

export function useMultilingualGeneration() {
    const { apiConfig } = useAppContext();
    const { streamCompletion, abort: abortLLM } = useStreamingLLM();

    const [queue, setQueue] = useState<LanguageQueueItem[]>([]);
    const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [selectedPreviewLanguage, setSelectedPreviewLanguage] = useState<string>("en");
    const [hreflangPack, setHreflangPack] = useState<string>("");
    const [sessionId, setSessionId] = useState<string | null>(null);

    const queueRef = useRef<LanguageQueueItem[]>([]);
    const stopRef = useRef(false);

    const updateQueueItem = useCallback((code: string, updates: Partial<LanguageQueueItem>) => {
        setQueue((prev) => {
            const newQueue = prev.map((item) =>
                item.language.code === code ? { ...item, ...updates } : item
            );
            queueRef.current = newQueue;
            return newQueue;
        });
    }, []);

    const generateHreflang = useCallback((currentQueue: LanguageQueueItem[]) => {
        const completed = currentQueue.filter(i => i.status === "complete");
        if (completed.length === 0) return "";

        const hreflangInput = {
            versions: completed.map(i => ({
                languageCode: i.language.code,
                hreflang: i.language.hreflang
            })),
            baseUrl: window.location.origin,
            slug: "todo-slug" // In real app, this would come from the generated title/slug
        };

        return generateHreflangHtml(hreflangInput);
    }, []);

    const startGeneration = useCallback(async (input: MultilingualInput) => {
        stopRef.current = false;
        setIsRunning(true);
        setIsDone(false);

        const id = nanoid();
        setSessionId(id);

        const initialQueue: LanguageQueueItem[] = input.targetLanguages.map((code) => {
            const lang = LANGUAGES.find((l) => l.code === code)!;
            return {
                language: lang,
                status: "queued",
                blogHtml: "",
                blogMarkdown: "",
                seoMeta: null,
                wordCount: 0,
                streamedText: "",
                progress: 0,
                error: null,
                startedAt: null,
                completedAt: null,
            };
        });

        setQueue(initialQueue);
        queueRef.current = initialQueue;

        // Create session in localStorage
        const session: MultilingualSession = {
            id,
            topic: input.topic,
            targetLanguages: input.targetLanguages,
            country: input.country,
            createdAt: new Date().toISOString(),
            versions: {},
        };
        languageQueueManager.saveSession(session);

        // Sequential generation
        for (const item of initialQueue) {
            if (stopRef.current) break;

            const langCode = item.language.code;
            setActiveLanguage(langCode);
            setSelectedPreviewLanguage(langCode);
            updateQueueItem(langCode, { status: "generating", startedAt: new Date().toISOString() });

            try {
                const payload = {
                    llmProvider: apiConfig.selectedModel,
                    apiKey: apiConfig.apiKey,
                    topic: input.topic,
                    languageCode: langCode,
                    country: input.country,
                    tone: input.tone,
                    wordCount: input.wordCount,
                    approvedOutline: input.approvedOutline,
                    authorDetails: input.authorDetails,
                };

                // Reuse localized prompt builder on client for streaming
                const response = await fetch("/api/multilingual/generate-version", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`Failed to generate ${item.language.name} version`);
                }

                const data = await response.json();
                const html = data.blogHtml;
                const markdown = "Markdown conversion todo"; // In a real app, we might use turndown or generate both
                const wordCount = html.split(/\s+/).length;

                // Generate SEO Meta for this version
                const seoRes = await fetch("/api/seo/meta", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        blogTitle: input.topic, // fallback
                        blogContent: html.substring(0, 4000),
                        country: input.country,
                        writerName: input.authorDetails?.name || "Expert Writer",
                        thumbnailUrl: "https://recuvix.in/default-thumb.png",
                    }),
                });
                const seoMeta = seoRes.ok ? (await seoRes.json()) as any : null;

                updateQueueItem(langCode, {
                    status: "complete",
                    blogHtml: html,
                    blogMarkdown: markdown,
                    wordCount,
                    seoMeta,
                    progress: 100,
                    completedAt: new Date().toISOString(),
                });

                // Update session in localStorage
                const currentSession = languageQueueManager.getSession(id)!;
                currentSession.versions[langCode] = {
                    status: "complete",
                    blogHtml: html,
                    blogMarkdown: markdown,
                    thumbnailUrl: "",
                    seoMeta,
                    wordCount,
                    generatedAt: new Date().toISOString(),
                };
                languageQueueManager.saveSession(currentSession);

                // Rate limit safety delay
                if (!stopRef.current) {
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }

            } catch (err: any) {
                updateQueueItem(langCode, {
                    status: "failed",
                    error: err.message || "Generation failed",
                });

                const currentSession = languageQueueManager.getSession(id)!;
                currentSession.versions[langCode] = {
                    status: "failed",
                    blogHtml: "",
                    blogMarkdown: "",
                    thumbnailUrl: "",
                    seoMeta: null as any,
                    wordCount: 0,
                    generatedAt: new Date().toISOString(),
                    error: err.message || "Generation failed",
                };
                languageQueueManager.saveSession(currentSession);
            }
        }

        setIsRunning(false);
        setIsDone(true);
        setActiveLanguage(null);
        setHreflangPack(generateHreflang(queueRef.current));
    }, [apiConfig, updateQueueItem, generateHreflang]);

    const cancelAll = useCallback(() => {
        stopRef.current = true;
        abortLLM();
        setIsRunning(false);
    }, [abortLLM]);

    const retryLanguage = useCallback((code: string) => {
        // Logic to retry a specific language
        console.log("Retry requested for", code);
    }, []);

    const downloadAll = useCallback(async () => {
        // Package all into ZIP and download
        const completedItems = queue.filter(i => i.status === "complete");
        if (completedItems.length === 0) return;

        const hreflangInput = {
            versions: completedItems.map(i => ({
                languageCode: i.language.code,
                hreflang: i.language.hreflang
            })),
            baseUrl: window.location.origin,
            slug: "blog-post"
        };

        const zipBlob = await packageMultilingualZip({
            versions: completedItems.map(i => ({
                language: i.language,
                blogHtml: i.blogHtml,
                blogMarkdown: i.blogMarkdown,
                seoMeta: i.seoMeta
            })),
            hreflangHtml: generateHreflangHtml(hreflangInput),
            hreflangJson: generateHreflangJson(hreflangInput),
            topic: "Blog Post"
        });

        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recuvix-multilingual-${new Date().getTime()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [queue]);

    return {
        queue,
        activeLanguage,
        completedCount: queue.filter(i => i.status === "complete").length,
        totalCount: queue.length,
        isRunning,
        isDone,
        selectedPreviewLanguage,
        hreflangPack,
        startGeneration,
        cancelAll,
        retryLanguage,
        setPreviewLanguage: setSelectedPreviewLanguage,
        downloadAll,
    };
}
