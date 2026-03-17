import { buildRepurposePrompt, RepurposeFormat, RepurposeParams } from './repurposePromptBuilder';
import { parseRepurposeResponse, RepurposeContent } from './repurposeContentParser';
import { streamFromClaude, streamFromOpenAI, streamFromGemini, streamFromGrok } from '../managed/providerClients';

export interface ApiConfig {
    selectedModel: 'claude' | 'openai' | 'gemini' | 'grok';
    apiKey: string;
}

export async function generateRepurposedContent(
    format: RepurposeFormat,
    params: RepurposeParams,
    apiConfig: ApiConfig,
    onChunk: (text: string) => void,
    onComplete: (content: RepurposeContent) => void,
    onError: (error: string) => void,
    signal: AbortSignal
): Promise<void> {
    const prompt = buildRepurposePrompt(format, params);
    const { selectedModel, apiKey } = apiConfig;

    let accumulatedText = '';

    const handleChunk = (chunk: string) => {
        accumulatedText += chunk;
        onChunk(accumulatedText);
    };

    const handleComplete = () => {
        const parsed = parseRepurposeResponse(format, accumulatedText);
        onComplete({
            ...parsed,
            generatedAt: new Date().toISOString(),
            model: selectedModel,
            edited: false,
        });
    };

    const handleError = (err: Error) => {
        onError(err.message);
    };

    try {
        switch (selectedModel) {
            case 'claude':
                await streamFromClaude(
                    apiKey,
                    'claude-3-5-sonnet-20241022',
                    prompt,
                    4000,
                    handleChunk,
                    () => handleComplete(),
                    handleError,
                    signal
                );
                break;
            case 'openai':
                await streamFromOpenAI(
                    apiKey,
                    'gpt-4o',
                    prompt,
                    4000,
                    handleChunk,
                    () => handleComplete(),
                    handleError,
                    signal
                );
                break;
            case 'gemini':
                await streamFromGemini(
                    apiKey,
                    'gemini-1.5-flash-latest',
                    prompt,
                    4000,
                    handleChunk,
                    () => handleComplete(),
                    handleError,
                    signal
                );
                break;
            case 'grok':
                await streamFromGrok(
                    apiKey,
                    'grok-2-latest',
                    prompt,
                    4000,
                    handleChunk,
                    () => handleComplete(),
                    handleError,
                    signal
                );
                break;
            default:
                throw new Error(`Unsupported model: ${selectedModel}`);
        }
    } catch (err: any) {
        if (err.name === 'AbortError') return;
        onError(err.message || 'Unknown error during generation');
    }
}

/**
 * Generates multiple formats in parallel with a concurrency limit.
 */
export async function generateMultipleFormats(
    formats: RepurposeFormat[],
    params: RepurposeParams,
    apiConfig: ApiConfig,
    onFormatChunk: (format: RepurposeFormat, text: string) => void,
    onFormatComplete: (format: RepurposeFormat, content: RepurposeContent) => void,
    onFormatError: (format: RepurposeFormat, error: string) => void,
    signal: AbortSignal,
    concurrencyLimit = 3
): Promise<void> {
    const queue = [...formats];
    const active: Promise<void>[] = [];

    const processNext = async (): Promise<void> => {
        if (queue.length === 0 || signal.aborted) return;

        const format = queue.shift()!;
        const promise = generateRepurposedContent(
            format,
            params,
            apiConfig,
            (text) => onFormatChunk(format, text),
            (content) => onFormatComplete(format, content),
            (error) => onFormatError(format, error),
            signal
        ).finally(() => {
            active.splice(active.indexOf(promise), 1);
        });

        active.push(promise);

        if (active.length < concurrencyLimit) {
            await processNext();
        } else {
            await Promise.race(active);
            await processNext();
        }
    };

    await processNext();
    await Promise.allSettled(active);
}
