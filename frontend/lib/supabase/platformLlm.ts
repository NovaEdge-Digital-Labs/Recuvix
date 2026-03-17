import { supabaseAdmin } from './admin'

export async function getPlatformApiKey(provider: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabaseAdmin.from('platform_api_keys') as any)
        .select('encrypted_key')
        .eq('provider', provider)
        .eq('is_active', true)
        .single()

    if (error || !data) {
        // Fallback to environment variables if not in DB
        const envKey = process.env[`PLATFORM_${provider.toUpperCase()}_KEY`]
        if (envKey) return envKey
        throw new Error(`API key for ${provider} not found or inactive`)
    }

    // In a real app, you would decrypt the key here
    // For this demo, we assume the key is stored as is or handled by the system
    return (data as { encrypted_key: string }).encrypted_key
}

export async function streamPlatformLLM({
    provider,
    prompt,
    systemInstruction,
    onChunk,
}: {
    provider: string
    prompt: string
    systemInstruction?: string
    onChunk: (text: string) => void
}) {
    const apiKey = await getPlatformApiKey(provider)

    let response: Response

    if (provider === 'claude') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                system: systemInstruction,
                messages: [{ role: 'user', content: prompt }],
                stream: true,
            }),
        })
    } else if (provider === 'openai') {
        const messages = []
        if (systemInstruction) {
            messages.push({ role: 'system', content: systemInstruction })
        }
        messages.push({ role: 'user', content: prompt })

        response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages,
                stream: true,
            }),
        })
    } else if (provider === 'gemini') {
        const modelName = 'gemini-3-flash-preview'
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`

        const payload: {
            contents: Array<{ role: string; parts: Array<{ text: string }> }>;
            system_instruction?: { parts: Array<{ text: string }> };
        } = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }

        if (systemInstruction) {
            payload.system_instruction = { parts: [{ text: systemInstruction }] }
        }

        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
    } else if (provider === 'grok') {
        const messages = []
        if (systemInstruction) {
            messages.push({ role: 'system', content: systemInstruction })
        }
        messages.push({ role: 'user', content: prompt })

        response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'grok-2-latest',
                messages,
                stream: true,
            }),
        })
    } else {
        throw new Error('Invalid provider')
    }

    if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`API Error: ${response.status} ${errorData}`)
    }

    if (!response.body) throw new Error('No response body')

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ""

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ""

        for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine || trimmedLine.startsWith(':')) continue

            if (trimmedLine.startsWith('data: ')) {
                const dataStr = trimmedLine.slice('data: '.length)
                if (dataStr === '[DONE]') continue

                try {
                    const data = JSON.parse(dataStr)
                    let chunkText = ""

                    if (provider === 'claude') {
                        if (data.type === 'content_block_delta' && data.delta?.text) {
                            chunkText = data.delta.text
                        }
                    } else if (provider === 'openai' || provider === 'grok') {
                        if (data.choices?.[0]?.delta?.content) {
                            chunkText = data.choices[0].delta.content
                        }
                    } else if (provider === 'gemini') {
                        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                            chunkText = data.candidates[0].content.parts[0].text
                        }
                    }

                    if (chunkText) {
                        onChunk(chunkText)
                    }
                } catch {
                    // Ignore parse errors from incomplete chunks
                }
            }
        }
    }
}
