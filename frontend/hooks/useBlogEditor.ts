"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import {
    RecuvixCurrentBlog,
    EditHistoryEntry,
    EditType
} from "@/lib/types/editor";
import { useAppContext } from "@/context/AppContext";
import { useSectionParser } from "./useSectionParser";
import { sanitizeEditedHtml } from "@/lib/results/htmlSanitizer";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { blogsService } from "@/lib/db/blogsService";
import { useStreamingLLM } from "./useStreamingLLM";
import { generateSeoMeta } from "@/lib/utils/blogProcessor";

export interface RegenParams {
    instruction: string;
    keepStructure: boolean;
    wordCountOverride?: number;
    showComparison: boolean;
}

export function useBlogEditor() {
    const { lastOutput, apiConfig } = useAppContext();
    const { user } = useAuth();
    const { streamCompletion } = useStreamingLLM();
    const { parseHtml, replaceSectionHtml, getSectionHtml } = useSectionParser();

    // State
    const [blog, setBlog] = useState<RecuvixCurrentBlog | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [regenStreamText, setRegenStreamText] = useState("");
    const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
    const [activeSectionAction, setActiveSectionAction] = useState<string | null>(null);
    const [sectionStreamText, setSectionStreamText] = useState("");
    const [isHydrated, setIsHydrated] = useState(false);

    // Initialize from lastOutput or localStorage
    useEffect(() => {
        let parsedStored: any = null;
        const stored = localStorage.getItem("recuvix_current_blog");
        if (stored) {
            try {
                parsedStored = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse stored blog", e);
            }
        }

        if (parsedStored && parsedStored.currentHtml) {
            // Already a valid RecuvixCurrentBlog
            setBlog(parsedStored);
        } else if (parsedStored && parsedStored.blogHtml) {
            // It's HistoryContent mapped to RecuvixCurrentBlog
            const initialBlog: RecuvixCurrentBlog = {
                id: localStorage.getItem("recuvix_current_history_id") || nanoid(),
                originalHtml: parsedStored.blogHtml,
                currentHtml: parsedStored.blogHtml,
                currentMarkdown: parsedStored.blogMarkdown,
                editHistory: [],
                seoMeta: parsedStored.seoMeta || {},
                thumbnailUrl: parsedStored.thumbnailUrl || "",
                generationInput: parsedStored.generationInput || {},
                topic: parsedStored.generationInput?.topic || "Restored Blog",
                focusKeyword: parsedStored.seoMeta?.focusKeyword || "",
                country: parsedStored.generationInput?.country || "Global",
                wordCount: parsedStored.wordCount || parsedStored.blogHtml.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length || 0,
                source: parsedStored.source || 'standard',
                createdAt: new Date().toISOString(),
                lastEditedAt: new Date().toISOString(),
            };
            setBlog(initialBlog);
            localStorage.setItem("recuvix_current_blog", JSON.stringify(initialBlog));
        } else if (lastOutput) {
            const initialBlog: RecuvixCurrentBlog = {
                id: nanoid(),
                originalHtml: lastOutput.blogHtml,
                currentHtml: lastOutput.blogHtml,
                currentMarkdown: lastOutput.blogMarkdown,
                editHistory: [],
                seoMeta: lastOutput.seoMeta,
                thumbnailUrl: lastOutput.thumbnailUrl,
                generationInput: { topic: lastOutput.topic }, // Best effort
                topic: lastOutput.topic,
                focusKeyword: (lastOutput.seoMeta as any)?.focusKeyword || "",
                country: "Global", // Default
                wordCount: lastOutput.blogHtml.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length || 0,
                source: (lastOutput as any).source || 'standard',
                createdAt: new Date().toISOString(),
                lastEditedAt: new Date().toISOString(),
            };
            setBlog(initialBlog);
            localStorage.setItem("recuvix_current_blog", JSON.stringify(initialBlog));
        }
        setIsHydrated(true);
    }, [lastOutput]);

    // Persistence
    useEffect(() => {
        if (isHydrated && blog) {
            localStorage.setItem("recuvix_current_blog", JSON.stringify(blog));
        }
    }, [blog, isHydrated]);

    const toggleEditMode = useCallback(() => {
        setIsEditMode(prev => !prev);
    }, []);

    const addHistoryEntry = useCallback((entry: Omit<EditHistoryEntry, "id" | "createdAt">) => {
        const timestamp = new Date().toISOString();
        const entryId = nanoid();

        setBlog(prev => {
            if (!prev) return null;
            const newEntry: EditHistoryEntry = {
                ...entry,
                id: entryId,
                createdAt: timestamp,
            };
            const newHistory = [newEntry, ...prev.editHistory].slice(0, 10);

            // Sync to Supabase if possible
            if (user && prev.id) {
                blogsService.update(prev.id, {
                    edit_history: newHistory as any,
                    updated_at: timestamp
                }).catch(err => console.error("Failed to sync history entry", err));
            }

            return {
                ...prev,
                editHistory: newHistory,
                lastEditedAt: timestamp,
            };
        });
    }, [user]);

    const saveInlineEdit = useCallback((sectionIndex: number, newHtml: string) => {
        setBlog(prev => {
            if (!prev) return null;
            const htmlBefore = prev.currentHtml;
            const sanitizedHtml = sanitizeEditedHtml(newHtml);
            const updatedHtml = replaceSectionHtml(prev.currentHtml, sectionIndex, sanitizedHtml);

            const sections = parseHtml(updatedHtml);
            const section = sections[sectionIndex];

            const htmlAfter = updatedHtml;
            const wordCount = updatedHtml.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;

            addHistoryEntry({
                type: "section_edit",
                description: `Edited Section ${sectionIndex + 1}: ${section?.h2Text || ""}`,
                htmlBefore,
                htmlAfter: updatedHtml,
                instruction: "Manual inline edit",
                sectionH2: section?.h2Text,
            });

            if (user && prev.id) {
                blogsService.update(prev.id, {
                    blog_html: updatedHtml,
                    word_count: wordCount,
                    updated_at: new Date().toISOString()
                }).catch(err => console.error("Failed to sync inline edit", err));
            }

            return {
                ...prev,
                currentHtml: updatedHtml,
                wordCount,
            };
        });
        toast.success("Changes saved");
    }, [replaceSectionHtml, parseHtml, addHistoryEntry, user]);

    // SSE Handlers
    const handleStream = async (url: string, body: any, onChunk: (text: string) => void, onDone: (text: string, wordCount: number) => void) => {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error("Failed to start stream");
        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data: ")) continue;

                const dataStr = trimmed.slice(6);
                if (dataStr === "[DONE]") continue;

                let data;
                try {
                    data = JSON.parse(dataStr);
                } catch (e) {
                    console.warn("Failed to parse SSE event in useBlogEditor:", e);
                    continue; // Skip unparseable lines gracefully instead of crashing
                }

                if (data.type === "chunk") {
                    fullText += data.text;
                    onChunk(fullText);
                } else if (data.type === "done") {
                    onDone(fullText, data.wordCount);
                } else if (data.type === "error") {
                    throw new Error(data.message);
                }
            }
        }
    };

    const regenerateBlog = useCallback(async (params: RegenParams) => {
        if (!blog || !apiConfig.apiKey) return;
        setIsRegenerating(true);
        setRegenStreamText("");

        try {
            await handleStream(
                "/api/edit/regenerate-blog",
                {
                    llmProvider: apiConfig.selectedModel,
                    apiKey: apiConfig.apiKey,
                    originalTopic: blog.topic,
                    originalHtml: blog.currentHtml,
                    instruction: params.instruction,
                    country: blog.country,
                    tone: "Professional", // Fallback
                    wordCount: params.wordCountOverride || blog.wordCount,
                    focusKeyword: blog.focusKeyword,
                    keepStructure: params.keepStructure,
                },
                (text) => setRegenStreamText(text),
                (finalHtml, newWordCount) => {
                    if (!params.showComparison) {
                        const htmlBefore = blog.currentHtml;
                        setBlog(prev => prev ? {
                            ...prev,
                            currentHtml: finalHtml,
                            wordCount: newWordCount,
                        } : null);

                        addHistoryEntry({
                            type: "full_regen",
                            description: `Full Blog Regeneration: ${params.instruction}`,
                            htmlBefore,
                            htmlAfter: finalHtml,
                            instruction: params.instruction,
                        });

                        if (user && blog.id) {
                            blogsService.update(blog.id, {
                                blog_html: finalHtml,
                                word_count: newWordCount,
                                updated_at: new Date().toISOString()
                            }).catch(err => console.error("Failed to sync regeneration", err));
                        }
                    }
                    setIsRegenerating(false);
                }
            );
        } catch (e: any) {
            toast.error(`Regeneration failed: ${e.message}`);
            setIsRegenerating(false);
        }
    }, [blog, apiConfig, addHistoryEntry, user]);

    const rewriteSection = useCallback(async (index: number, instruction: string) => {
        if (!blog || !apiConfig.apiKey) return;
        setActiveSectionIndex(index);
        setActiveSectionAction("rewrite");
        setSectionStreamText("");

        try {
            const section = parseHtml(blog.currentHtml)[index];
            await handleStream(
                "/api/edit/regenerate-section",
                {
                    llmProvider: apiConfig.selectedModel,
                    apiKey: apiConfig.apiKey,
                    blogTopic: blog.topic,
                    fullBlogContext: blog.currentHtml.slice(0, 3000),
                    sectionH2: section.h2Text,
                    currentSectionHtml: section.fullSectionHtml,
                    instruction,
                    country: blog.country,
                    tone: "Professional",
                    focusKeyword: blog.focusKeyword,
                    sectionPosition: index + 1,
                    totalSections: parseHtml(blog.currentHtml).length,
                    action: "rewrite",
                },
                (text) => setSectionStreamText(text),
                () => {
                    // Keep in streaming state until accepted/discarded
                }
            );
        } catch (e: any) {
            toast.error(`Section rewrite failed: ${e.message}`);
            setActiveSectionIndex(null);
        }
    }, [blog, apiConfig, parseHtml]);

    const acceptSectionChange = useCallback((index: number, newSectionHtml: string) => {
        setBlog(prev => {
            if (!prev) return null;
            const htmlBefore = prev.currentHtml;
            const updatedHtml = replaceSectionHtml(prev.currentHtml, index, newSectionHtml);

            const htmlAfter = updatedHtml;
            const wordCount = updatedHtml.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;

            addHistoryEntry({
                type: "section_regen",
                description: `Regenerated Section ${index + 1}`,
                htmlBefore,
                htmlAfter: updatedHtml,
                instruction: "AI Regeneration",
                sectionH2: parseHtml(updatedHtml)[index]?.h2Text,
            });

            if (user && prev.id) {
                blogsService.update(prev.id, {
                    blog_html: updatedHtml,
                    word_count: wordCount,
                    updated_at: new Date().toISOString()
                }).catch(err => console.error("Failed to sync section change", err));
            }

            return {
                ...prev,
                currentHtml: updatedHtml,
                wordCount,
            };
        });
        setActiveSectionIndex(null);
        setActiveSectionAction(null);
        setSectionStreamText("");
        toast.success("Section updated");
    }, [replaceSectionHtml, addHistoryEntry, parseHtml, user]);

    const discardSectionChange = useCallback(() => {
        setActiveSectionIndex(null);
        setActiveSectionAction(null);
        setSectionStreamText("");
    }, []);

    const restoreVersion = useCallback((historyId: string) => {
        setBlog(prev => {
            if (!prev) return null;
            const entry = prev.editHistory.find(e => e.id === historyId);
            if (!entry) return prev;

            const htmlBefore = prev.currentHtml;
            addHistoryEntry({
                type: "full_regen",
                description: `Restored to version from ${new Date(entry.createdAt).toLocaleTimeString()}`,
                htmlBefore,
                htmlAfter: entry.htmlAfter,
                instruction: "History restore",
            });

            return {
                ...prev,
                currentHtml: entry.htmlAfter,
                wordCount: entry.htmlAfter.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length,
            };
        });
        toast.success("Version restored");
    }, [addHistoryEntry]);

    const clearHistory = useCallback(() => {
        setBlog(prev => prev ? { ...prev, editHistory: [] } : null);
        toast.success("History cleared");
    }, []);

    const updateSeoMeta = useCallback(async () => {
        if (!blog) return;

        try {
            const newSeoMeta = await generateSeoMeta(
                blog.currentMarkdown,
                { topic: blog.topic, country: blog.country } as any,
                blog.thumbnailUrl,
                streamCompletion
            );

            if (newSeoMeta) {
                setBlog(prev => {
                    if (!prev) return null;
                    const updatedBlog = { ...prev, seoMeta: newSeoMeta };

                    if (user && prev.id) {
                        blogsService.update(prev.id, {
                            seo_meta: newSeoMeta as any,
                            updated_at: new Date().toISOString()
                        }).catch(err => console.error("Failed to sync SEO update", err));
                    }
                    return updatedBlog;
                });
                toast.success("SEO Meta Pack updated successfully");
            } else {
                toast.error("Failed to regenerate SEO meta");
            }
        } catch (e: any) {
            toast.error(`SEO regeneration failed: ${e.message}`);
        }
    }, [blog, streamCompletion, user]);

    return {
        blog,
        currentHtml: blog?.currentHtml || "",
        isEditMode,
        toggleEditMode,
        isRegenerating,
        regenStreamText,
        activeSectionIndex,
        activeSectionAction,
        sectionStreamText,
        wordCount: blog?.wordCount || 0,
        editHistory: blog?.editHistory || [],
        regenerateBlog,
        rewriteSection,
        saveInlineEdit,
        acceptSectionChange,
        discardSectionChange,
        restoreVersion,
        clearHistory,
        updateSeoMeta,
    };
}
