import {
    streamFromClaude,
    streamFromOpenAI,
    streamFromGemini,
    streamFromGrok,
    TokenUsage
} from './providerClients'

export async function forwardLLMStream(
    provider: string,
    apiKey: string,
    model: string,
    prompt: string,
    writer: WritableStreamDefaultWriter,
    signal: AbortSignal,
): Promise<{
    blogHtml: string,
    tokenCount: number,
    success: boolean,
    errorCode: string | null,
}> {
    const encoder = new TextEncoder()
    let accumulatedText = ''
    let tokenCount = 0
    let success = false
    let errorCode: string | null = null

    const onChunk = async (text: string) => {
        accumulatedText += text
        await writer.write(
            encoder.encode('data: ' + JSON.stringify({ type: 'chunk', text }) + '\n\n')
        )
    }

    const onComplete = (usage: TokenUsage) => {
        tokenCount = usage.totalTokens
        success = true
    }

    const onError = (error: Error, code: string) => {
        console.error(`LLM Stream Error (${provider}):`, error)
        errorCode = code
        success = false
    }

    const streamFn = provider === 'claude' ? streamFromClaude :
        provider === 'openai' ? streamFromOpenAI :
            provider === 'gemini' ? streamFromGemini :
                streamFromGrok

    await streamFn(
        apiKey,
        model,
        prompt,
        4000, // maxTokens
        onChunk,
        onComplete,
        onError,
        signal
    )

    return {
        blogHtml: accumulatedText,
        tokenCount,
        success,
        errorCode,
    }
}
