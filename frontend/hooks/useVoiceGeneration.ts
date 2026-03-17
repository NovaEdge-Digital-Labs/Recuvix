"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { historyManager } from "@/lib/history/historyManager";

export interface VoiceGenerationData {
    recordingId: string;
    blogTitle: string;
    focusKeyword: string;
    tone: string;
    wordCount: number;
    preserveVoice: boolean;
    includeQuotes: boolean;
    addSeoEnhancements: boolean;
    source: 'voice';
}

export function useVoiceGeneration() {
    const router = useRouter();

    const [status, setStatus] = useState<"idle" | "generating" | "complete" | "error">("idle");
    const [stepMessage, setStepMessage] = useState("");
    const [streamedText, setStreamedText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const abortControllerRef = useRef<AbortController | null>(null);

    const generateFromVoice = useCallback(async (data: VoiceGenerationData) => {
        setStatus("generating");
        setStreamedText("");
        setStepMessage("Initializing voice generation...");
        setError(null);
        setProgress(5);

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const response = await fetch("/api/voice/generate-blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('supabase-auth-token')}`
                },
                body: JSON.stringify(data),
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

                    if (dataStr === "[DONE]") {
                        setStatus("complete");
                        setProgress(100);
                        continue;
                    }

                    try {
                        const event = JSON.parse(dataStr);

                        if (event.type === "step") {
                            setStepMessage(event.message);
                            setProgress(prev => Math.max(prev, (event.step || 1) * 20));
                        } else if (event.type === "chunk") {
                            setStreamedText(prev => prev + event.text);
                            setProgress(prev => Math.min(95, prev + 0.5));
                        } else if (event.type === "done") {
                            setStatus("complete");
                            setProgress(100);

                            // Save to local history
                            await historyManager.saveToHistory({
                                title: data.blogTitle,
                                topic: data.blogTitle,
                                blogMarkdown: event.blogMarkdown || event.blogHtml,
                                blogHtml: event.blogHtml,
                                seoMeta: event.seoMeta || {},
                                thumbnailUrl: event.thumbnailUrl || "",
                                model: "voice-whisper",
                                country: "Global",
                                focusKeyword: data.focusKeyword,
                                format: "html",
                                generationInput: data,
                                wordCount: event.wordCount || 0,
                                source: 'voice'
                            });

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
                console.error("Voice generation error:", err);
                setError(err.message || "An unexpected error occurred");
                setStatus("error");
            }
        } finally {
            abortControllerRef.current = null;
        }
    }, [router]);

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setStatus("idle");
    }, []);

    return {
        generateFromVoice,
        cancel,
        status,
        stepMessage,
        streamedText,
        progress,
        error
    };
}
