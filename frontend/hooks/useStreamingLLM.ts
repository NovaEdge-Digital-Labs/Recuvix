"use client";

import { useCallback, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { AIModel } from "@/lib/types";

export interface StreamOptions {
    prompt: string;
    systemInstruction?: string;
    onChunk: (text: string) => void;
    onDone: (fullText: string) => void;
    onError: (error: Error) => void;
    managed?: boolean;
}

export function useStreamingLLM() {
    const { apiConfig } = useAppContext();
    const [isGenerating, setIsGenerating] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const abort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
    }, []);

    const streamCompletion = useCallback(
        async ({ prompt, systemInstruction, onChunk, onDone, onError, managed }: StreamOptions) => {
            if (!managed && (!apiConfig.selectedModel || !apiConfig.apiKey)) {
                onError(new Error("No API key or model selected. Please configure in settings."));
                return;
            }

            setIsGenerating(true);
            abortControllerRef.current = new AbortController();
            const signal = abortControllerRef.current.signal;

            let fullText = "";

            try {
                const { apiKey, selectedModel } = apiConfig;

                let response: Response;

                if (managed) {
                    response = await fetch("/api/managed/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            prompt,
                            systemInstruction,
                            model: apiConfig.selectedModel || "openai"
                        }),
                        signal,
                    });
                } else if (selectedModel === "claude") {
                    response = await fetch("https://api.anthropic.com/v1/messages", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": apiKey || "",
                            "anthropic-version": "2023-06-01",
                            "anthropic-dangerous-direct-browser-access": "true",
                        },
                        body: JSON.stringify({
                            model: "claude-3-5-sonnet-20241022",
                            max_tokens: 4000,
                            system: systemInstruction,
                            messages: [{ role: "user", content: prompt }],
                            stream: true,
                        }),
                        signal,
                    });
                } else if (selectedModel === "openai") {
                    const messages = [];
                    if (systemInstruction) {
                        messages.push({ role: "system", content: systemInstruction });
                    }
                    messages.push({ role: "user", content: prompt });

                    response = await fetch("https://api.openai.com/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: "gpt-4o",
                            messages,
                            stream: true,
                        }),
                        signal,
                    });
                } else if (selectedModel === "gemini") {
                    // Gemini SSE Stream implementation
                    const modelName = "gemini-1.5-flash";
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;
                    console.log(`[StreamingLLM] Fetching Gemini (v1beta) from: ${url}`);

                    const payload: any = {
                        contents: [{ role: "user", parts: [{ text: prompt }] }],
                    };

                    if (systemInstruction) {
                        payload.system_instruction = { parts: [{ text: systemInstruction }] };
                    }

                    response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                        signal,
                    });
                } else if (selectedModel === "grok") {
                    const messages = [];
                    if (systemInstruction) {
                        messages.push({ role: "system", content: systemInstruction });
                    }
                    messages.push({ role: "user", content: prompt });

                    response = await fetch("https://api.x.ai/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: "grok-2-latest",
                            messages,
                            stream: true,
                        }),
                        signal,
                    });
                } else if (selectedModel === "openrouter") {
                    const messages = [];
                    if (systemInstruction) {
                        messages.push({ role: "system", content: systemInstruction });
                    }
                    messages.push({ role: "user", content: prompt });

                    response = await fetch("/api/proxy/openrouter/stream", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            apiKey,
                            model: "google/gemini-2.0-flash-001",
                            messages,
                            stream: true,
                            max_tokens: 4000,
                        }),
                        signal,
                    });
                } else {
                    throw new Error("Invalid model selected");
                }

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData}`);
                }

                if (!response.body) throw new Error("No response body");

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");

                    buffer = lines.pop() || ""; // Keep the incomplete line in the buffer

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine || trimmedLine.startsWith(":")) continue;

                        if (trimmedLine.startsWith("data: ")) {
                            const dataStr = trimmedLine.slice("data: ".length);

                            if (dataStr === "[DONE]") {
                                continue;
                            }

                            try {
                                const data = JSON.parse(dataStr);
                                let chunkText = "";

                                if (selectedModel === "claude") {
                                    if (data.type === "content_block_delta" && data.delta?.text) {
                                        chunkText = data.delta.text;
                                    }
                                } else if (selectedModel === "openai" || selectedModel === "grok" || selectedModel === "openrouter") {
                                    if (data.choices?.[0]?.delta?.content) {
                                        chunkText = data.choices[0].delta.content;
                                    }
                                } else if (selectedModel === "gemini") {
                                    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                        chunkText = data.candidates[0].content.parts[0].text;
                                    }
                                }

                                if (chunkText) {
                                    fullText += chunkText;
                                    onChunk(fullText);
                                }
                            } catch (e) {
                                // Ignore parsing errors for incomplete chunks
                                console.warn("Failed to parse SSE chunk", dataStr);
                            }
                        }
                    }
                }

                onDone(fullText);
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Streaming error:", error);
                    onError(error);
                }
            } finally {
                setIsGenerating(false);
            }
        },
        [apiConfig]
    );

    return { streamCompletion, abort, isGenerating };
}
