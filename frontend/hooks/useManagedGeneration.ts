"use client";

import { useState, useRef, useCallback } from "react";
import { BlogFormData } from "@/components/form/BlogForm";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCredits } from "./useCredits";
import { historyManager } from "@/lib/history/historyManager";
import { calendarService } from "@/lib/calendar/calendarService";

export function useManagedGeneration() {
    const { user } = useAuth();
    const { fetchBalance: refreshBalance } = useCredits();
    const router = useRouter();

    const [status, setStatus] = useState<"idle" | "generating" | "complete" | "error">("idle");
    const [currentStep, setCurrentStep] = useState(0);
    const [stepMessage, setStepMessage] = useState("");
    const [streamedText, setStreamedText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const abortControllerRef = useRef<AbortController | null>(null);

    const generate = useCallback(async (data: BlogFormData) => {
        setStatus("generating");
        setStreamedText("");
        setCurrentStep(1);
        setStepMessage("Initializing managed generation...");
        setError(null);
        setProgress(5);

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const response = await fetch("/api/managed/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    preferredProvider: "claude", // Default or from context
                    outputFormat: "html",
                }),
                signal,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Generation failed");
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");

            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const dataStr = line.replace("data: ", "").trim();
                    if (!dataStr) continue;

                    try {
                        const event = JSON.parse(dataStr);

                        if (event.type === "step") {
                            setCurrentStep(event.step);
                            setStepMessage(event.message);
                            setProgress(prev => Math.max(prev, event.step * 20));
                        } else if (event.type === "chunk") {
                            setStreamedText(prev => prev + event.text);
                            setProgress(prev => Math.min(90, prev + 0.1));
                        } else if (event.type === "done") {
                            setStatus("complete");
                            setProgress(100);

                            // Save to local history
                            await historyManager.saveToHistory({
                                title: data.topic,
                                topic: data.topic,
                                blogMarkdown: event.blogMarkdown || event.blogHtml,
                                blogHtml: event.blogHtml,
                                seoMeta: event.seoMeta || {},
                                thumbnailUrl: event.thumbnailUrl || "",
                                model: "managed",
                                country: data.country,
                                focusKeyword: data.topic,
                                format: "html",
                                generationInput: data,
                                wordCount: event.wordCount || 0,
                                calendarEntryId: data.calendarEntryId
                            });

                            // Update calendar entry if it exists
                            if (data.calendarEntryId) {
                                calendarService.updateEntry(data.calendarEntryId, {
                                    status: 'published',
                                    blog_id: event.blogId,
                                    published_url: `/results?id=${event.blogId}`
                                }).catch(err => console.error("Failed to update calendar entry:", err));
                            }

                            refreshBalance();
                            router.push(`/results?id=${event.blogId}`);
                        } else if (event.type === "error") {
                            throw new Error(event.error || "An error occurred during generation");
                        }
                    } catch (e) {
                        console.warn("Failed to parse SSE event", e);
                    }
                }
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                setError("Generation cancelled");
            } else {
                console.error("Managed generation error:", err);
                setError(err.message || "An unexpected error occurred");
                setStatus("error");
            }
        } finally {
            abortControllerRef.current = null;
        }
    }, [user, refreshBalance, router]);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setStatus("idle");
    }, []);

    return {
        generate,
        cancel,
        status,
        currentStep,
        stepMessage,
        streamedText,
        progress,
        error
    };
}
