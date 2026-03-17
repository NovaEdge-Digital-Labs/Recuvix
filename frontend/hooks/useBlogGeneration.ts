"use client";

import { useState } from "react";
import { BlogFormData } from "@/components/form/BlogForm";
import { useStreamingLLM } from "./useStreamingLLM";
import { buildBlogPrompt, buildSystemInstruction } from "@/lib/prompts/promptBuilder";
import { processImagesInMarkdown, generateThumbnail, generateSeoMeta } from "@/lib/utils/blogProcessor";
import { useAppContext } from "@/context/AppContext";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { historyManager } from "@/lib/history/historyManager";
import { useAuth } from "@/context/AuthContext";
import { blogsService } from "@/lib/db/blogsService";
import { calendarService } from "@/lib/calendar/calendarService";
import { useCredits } from "./useCredits";

export type GenerationStep = "analyzing" | "writing" | "sourcing" | "seo" | "packaging" | "done" | "error";

export function useBlogGeneration() {
    const { streamCompletion, abort: abortLLM } = useStreamingLLM();
    const { preferences, setLastOutput, apiConfig } = useAppContext();
    const { user } = useAuth();
    const { isManagedMode } = useCredits();
    const router = useRouter();

    const [step, setStep] = useState<GenerationStep>("analyzing");
    const [streamedMarkdown, setStreamedMarkdown] = useState("");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const startGeneration = async (data: BlogFormData) => {
        setStep("analyzing");
        setProgress(5);
        setStreamedMarkdown("");
        setError(null);

        // Read approved outline from localStorage (short-lived key set by OutlinePreviewPanel confirmation)
        let approvedOutline: { h1: string; h2s: string[]; focusKeyword: string } | undefined;
        try {
            const storedStr = localStorage.getItem("recuvix_approved_outline");
            if (storedStr) {
                const stored = JSON.parse(storedStr);
                if (stored.h1 && Array.isArray(stored.h2s)) {
                    approvedOutline = {
                        h1: stored.h1,
                        h2s: (stored.h2s as Array<{ text: string } | string>).map(h =>
                            typeof h === "string" ? h : h.text
                        ),
                        focusKeyword: stored.focusKeyword || "",
                    };
                }
                // Delete immediately so it doesn't persist
                localStorage.removeItem("recuvix_approved_outline");
            }
        } catch {
            // Ignore localStorage errors
        }

        const prompt = buildBlogPrompt({ ...data, approvedOutline });
        const systemInstruction = buildSystemInstruction();


        setStep("writing");
        setProgress(15);

        let rawMarkdown = "";

        try {
            await new Promise<void>((resolve, reject) => {
                streamCompletion({
                    prompt,
                    systemInstruction,
                    managed: isManagedMode,
                    onChunk: (text) => {
                        rawMarkdown = text;
                        setStreamedMarkdown(text);
                        setProgress(prev => Math.min(60, prev + 0.5));
                    },
                    onDone: (text) => {
                        rawMarkdown = text;
                        setStreamedMarkdown(text);
                        resolve();
                    },
                    onError: (err) => {
                        reject(err);
                    }
                });
            });

            setStep("sourcing");
            setProgress(65);
            const finalMarkdown = await processImagesInMarkdown(rawMarkdown, {
                ai: preferences.includeAiImages,
                stock: preferences.includeStockImages
            }, data.country);

            const titleMatch = finalMarkdown.match(/^#\s+(.*)/m);
            const title = titleMatch ? titleMatch[1] : data.topic;

            setStep("seo");
            setProgress(75);

            const thumbnailUrl = await generateThumbnail(data, title, streamCompletion);
            const seoMeta = await generateSeoMeta(finalMarkdown, data, thumbnailUrl, streamCompletion);

            setProgress(90);
            setStep("packaging");

            const parsedHtml = await Promise.resolve(marked.parse(finalMarkdown));
            const wordCount = finalMarkdown.split(/\s+/).length;

            // 1. Auto-save to History (localStorage)
            const historyId = await historyManager.saveToHistory({
                title,
                topic: data.topic,
                blogMarkdown: finalMarkdown,
                blogHtml: parsedHtml as string,
                seoMeta: seoMeta || {},
                thumbnailUrl: thumbnailUrl || "",
                model: apiConfig.selectedModel || "openai",
                country: data.country,
                focusKeyword: data.topic,
                format: "html",
                generationInput: data,
                wordCount,
                calendarEntryId: data.calendarEntryId
            });

            // 2. Save to Supabase in the background if authenticated (Don't await it to avoid UI freeze)
            let finalId = historyId;
            if (user) {
                // Kick off background insert 
                blogsService.create({
                    user_id: user.id,
                    title,
                    topic: data.topic,
                    focus_keyword: data.topic,
                    country: data.country,
                    word_count: wordCount,
                    format: "html",
                    model: apiConfig.selectedModel || "openai",
                    blog_html: parsedHtml as string,
                    blog_markdown: finalMarkdown,
                    seo_meta: seoMeta as any,
                    thumbnail_url: thumbnailUrl,
                    generation_input: data as any,
                    is_starred: false,
                    tags: [],
                    excerpt: "", // Fixed bug: was passing a function instead of a string
                } as any).then(blog => {
                    // Update calendar entry if it exists
                    if (data.calendarEntryId) {
                        calendarService.updateEntry(data.calendarEntryId, {
                            status: 'published',
                            blog_id: blog.id,
                            published_url: `/results?id=${blog.id}` // Temporary URL
                        }).catch(err => console.error("Failed to update calendar entry:", err));
                    }
                }).catch(err => console.error("Failed to save to Supabase history:", err));
            }

            setLastOutput({
                topic: data.topic,
                blogMarkdown: finalMarkdown,
                blogHtml: parsedHtml as string,
                seoMeta: seoMeta || {},
                thumbnailUrl: thumbnailUrl || "",
                generatedAt: Date.now()
            });

            setProgress(100);
            setStep("done");

            router.push(`/results?id=${finalId}`);

        } catch (err: unknown) {
            const e = err as any; // Temporary cast to match existing logic while satisfying ESLint
            if (e.name !== "AbortError") {
                console.error("Generation failed:", e);
                setError(e.message || "An unexpected error occurred during generation.");
                setStep("error");
            }
        }
    };

    const abort = () => {
        abortLLM();
        setStep("error");
        setProgress(0);
        setError("Generation was aborted by the user.");
    };

    return { startGeneration, abort, step, streamedMarkdown, progress, error };
}
