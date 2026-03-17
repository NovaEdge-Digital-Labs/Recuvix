export interface TokenUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export async function streamFromClaude(
    apiKey: string,
    model: string,
    prompt: string,
    maxTokens: number,
    onChunk: (text: string) => void,
    onComplete: (usage: TokenUsage) => void,
    onError: (error: Error, code: string) => void,
    signal: AbortSignal,
): Promise<void> {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
                stream: true,
            }),
            signal,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No body in response');

        const decoder = new TextDecoder();
        let promptTokens = 0;
        let completionTokens = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.type === 'content_block_delta') {
                            const text = data.delta.text;
                            onChunk(text);
                        } else if (data.type === 'message_start') {
                            promptTokens = data.message.usage.input_tokens;
                        } else if (data.type === 'message_delta') {
                            completionTokens = data.usage.output_tokens;
                        }
                    } catch {
                        // Partial JSON or other events
                    }
                }
            }
        }

        onComplete({
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
        });
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const error = err instanceof Error ? err : new Error(String(err));
        onError(error, error.message.includes('429') ? '429' : error.message.includes('401') ? '401' : '500');
    }
}

export async function streamFromOpenAI(
    apiKey: string,
    model: string,
    prompt: string,
    maxTokens: number,
    onChunk: (text: string) => void,
    onComplete: (usage: TokenUsage) => void,
    onError: (error: Error, code: string) => void,
    signal: AbortSignal,
): Promise<void> {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: maxTokens,
                stream: true,
            }),
            signal,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No body in response');

        const decoder = new TextDecoder();
        let promptTokens = 0; // OpenAI streaming doesn't always provide usage unless requested
        let completionTokens = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.trim() === 'data: [DONE]') break;
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        const text = data.choices[0]?.delta?.content || '';
                        if (text) onChunk(text);

                        // If usage is available (some models/configs)
                        if (data.usage) {
                            promptTokens = data.usage.prompt_tokens;
                            completionTokens = data.usage.completion_tokens;
                        }
                    } catch {
                        // Partial JSON
                    }
                }
            }
        }

        // Rough estimation if usage not provided
        if (promptTokens === 0) {
            promptTokens = Math.ceil(prompt.length / 4);
            completionTokens = Math.ceil(completionTokens / 4); // Need better tracking here
        }

        onComplete({
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
        });
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const error = err instanceof Error ? err : new Error(String(err));
        onError(error, error.message.includes('429') ? '429' : error.message.includes('401') ? '401' : '500');
    }
}

export async function streamFromGemini(
    apiKey: string,
    model: string,
    prompt: string,
    maxTokens: number,
    onChunk: (text: string) => void,
    onComplete: (usage: TokenUsage) => void,
    onError: (error: Error, code: string) => void,
    signal: AbortSignal,
): Promise<void> {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: maxTokens,
                },
            }),
            signal,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No body in response');

        const decoder = new TextDecoder();
        let promptTokens = 0;
        let completionTokens = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            // Gemini returns a JSON array of events
            try {
                const events = JSON.parse(chunk);
                for (const event of events) {
                    const text = event.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    if (text) onChunk(text);

                    if (event.usageMetadata) {
                        promptTokens = event.usageMetadata.promptTokenCount;
                        completionTokens = event.usageMetadata.candidatesTokenCount;
                    }
                }
            } catch {
                // Simple chunking might split JSON
            }
        }

        onComplete({
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
        });
    } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        const error = err instanceof Error ? err : new Error(String(err));
        onError(error, error.message.includes('429') ? '429' : error.message.includes('401') ? '401' : '500');
    }
}

export async function streamFromGrok(
    apiKey: string,
    model: string,
    prompt: string,
    maxTokens: number,
    onChunk: (text: string) => void,
    onComplete: (usage: TokenUsage) => void,
    onError: (error: Error, code: string) => void,
    signal: AbortSignal,
): Promise<void> {
    // Grok often uses OpenAI-compatible API
    return streamFromOpenAI(apiKey, model, prompt, maxTokens, onChunk, onComplete, onError, signal);
}
