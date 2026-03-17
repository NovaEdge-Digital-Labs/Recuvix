import { NextRequest, NextResponse } from "next/server";
import { regenerateBlogSchema } from "@/lib/validators/editSchemas";
import { resolveLLMKey } from "@/lib/wl/tenantKeyResolver";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const tenantId = req.headers.get('x-recuvix-tenant');
        const body = await req.json();
        const validation = regenerateBlogSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid request body", details: validation.error.format() }, { status: 400 });
        }

        const {
            llmProvider,
            apiKey: userApiKey,
            originalTopic,
            originalHtml,
            instruction,
            country,
            tone,
            wordCount,
            focusKeyword,
            secondaryKeywords = [],
            approvedOutline,
            keepStructure,
        } = validation.data;

        // Resolve the actual key to use (User BYOK > Tenant Key > Platform Key)
        const { key: resolvedKey, source: keySource } = await resolveLLMKey(
            llmProvider,
            tenantId,
            userApiKey
        );

        let prompt = `You are an expert SEO content writer. You are rewriting an existing blog post based on a specific instruction.

ORIGINAL TOPIC: ${originalTopic}
FOCUS KEYWORD: ${focusKeyword}
TARGET COUNTRY: ${country}
TONE: ${tone}
TARGET WORD COUNT: approximately ${wordCount || 1500} words

USER INSTRUCTION: ${instruction}
`;

        if (keepStructure) {
            prompt += `\nIMPORTANT: Keep the same H2 section headings as the original. Only rewrite the content within each section. Do not add or remove H2 sections.`;
        }

        if (approvedOutline) {
            prompt += `\nAPPROVED STRUCTURE TO FOLLOW:
H1: ${approvedOutline.h1}
H2 sections: ${approvedOutline.h2s.join(', ')}`;
        }

        prompt += `\n\nORIGINAL BLOG CONTENT (for reference):
${originalHtml.slice(0, 6000)}

REWRITING RULES:
1. Apply the user instruction throughout the entire blog
2. Maintain SEO optimization — keep focus keyword density at 1-2%, keep keyword in H1 and first paragraph
3. NO EMOJIS anywhere
4. Keep the same general topic and structure unless instruction says otherwise
5. The rewrite must be MEANINGFULLY different from the original in the ways the instruction specifies — not just minor wording changes
6. Preserve the FAQ section at the end
7. Preserve the author bio section if present
8. Country context must remain: ${country}

OUTPUT FORMAT: Return ONLY clean HTML. No markdown. No code fences. No explanation.
Start with <style> tag, then <article>, end with </article>.
Same CSS requirements as the original blog.

BEGIN REWRITING NOW.`;

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let response: Response;

                    if (llmProvider === "claude") {
                        response = await fetch("https://api.anthropic.com/v1/messages", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": resolvedKey,
                                "anthropic-version": "2023-06-01",
                            },
                            body: JSON.stringify({
                                model: "claude-3-5-sonnet-20241022",
                                max_tokens: 8000,
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                            }),
                        });
                    } else if (llmProvider === "openai") {
                        response = await fetch("https://api.openai.com/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${resolvedKey}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-4o",
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                            }),
                        });
                    } else if (llmProvider === "gemini") {
                        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${resolvedKey}`;
                        response = await fetch(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }],
                            }),
                        });
                    } else if (llmProvider === "grok") {
                        response = await fetch("https://api.x.ai/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${resolvedKey}`,
                            },
                            body: JSON.stringify({
                                model: "grok-2-latest",
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                            }),
                        });
                    } else {
                        throw new Error("Unsupported LLM provider");
                    }

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`LLM API Error: ${response.status} - ${errorText}`);
                    }

                    if (!response.body) throw new Error("No response body");

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let fullGeneratedText = "";
                    let buffer = "";

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            const trimmedLine = line.trim();
                            if (!trimmedLine || trimmedLine.startsWith(":")) continue;

                            if (trimmedLine.startsWith("data: ")) {
                                const dataStr = trimmedLine.slice(6);
                                if (dataStr === "[DONE]") continue;

                                try {
                                    const data = JSON.parse(dataStr);
                                    let chunkText = "";

                                    if (llmProvider === "claude") {
                                        if (data.type === "content_block_delta" && data.delta?.text) {
                                            chunkText = data.delta.text;
                                        }
                                    } else if (llmProvider === "openai" || llmProvider === "grok") {
                                        if (data.choices?.[0]?.delta?.content) {
                                            chunkText = data.choices[0].delta.content;
                                        }
                                    } else if (llmProvider === "gemini") {
                                        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                                            chunkText = data.candidates[0].content.parts[0].text;
                                        }
                                    }

                                    if (chunkText) {
                                        fullGeneratedText += chunkText;
                                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`));
                                    }
                                } catch (e) {
                                    // Silent catch for parse errors
                                }
                            }
                        }
                    }

                    const wordCount = fullGeneratedText.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", wordCount })}\n\n`));
                    controller.close();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    console.error("SSE Stream Error:", error);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });

    } catch (error: any) {
        console.error("Regenerate Blog API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to initiate regeneration" }, { status: 500 });
    }
}
