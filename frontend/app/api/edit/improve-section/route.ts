import { NextRequest, NextResponse } from "next/server";
import { improveSectionSchema } from "@/lib/validators/editSchemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = improveSectionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid request body", details: validation.error.format() }, { status: 400 });
        }

        const {
            llmProvider,
            apiKey,
            sectionH2,
            currentSectionHtml,
            action,
            country,
            focusKeyword,
        } = validation.data;

        const actionPrompts = {
            fix_grammar: "Fix any grammar, spelling, and punctuation errors. Improve sentence flow. Do not change the content.",
            add_examples: "Add 2-3 specific, real-world examples to make this section more concrete and credible.",
            add_statistics: `Add 2-3 relevant statistics or data points to strengthen the claims in this section. Use realistic figures appropriate for ${country} market context.`,
            make_scannable: "Restructure this section to be more scannable. Add bullet points, bold key phrases, and short intro sentences for each paragraph.",
            improve_seo: `Improve the SEO of this section. Include the focus keyword '${focusKeyword}' naturally once more. Add 2-3 semantic/LSI keywords. Ensure the content thoroughly covers the subtopic.`,
            add_cta: "Add a natural call-to-action at the end of this section. Keep it soft and helpful, not salesy.",
        };

        const prompt = `You are an expert SEO content writer. You are improving ONE specific section of a blog post.

SECTION HEADING: ${sectionH2}
ACTION: ${action}
INSTRUCTION: ${actionPrompts[action]}

CURRENT SECTION CONTENT:
${currentSectionHtml}

CRITICAL RULES:
1. Return ONLY the HTML for this one section
2. Start with the H2 heading: <h2>...</h2>
3. End after the last paragraph of this section
4. NO EMOJIS
5. If the section contains a table or list, preserve that element unless the instruction says to change it
6. Keep any [INTERNALLINK: ...] placeholders as-is

OUTPUT FORMAT: Return ONLY the HTML for this section. No style tags. No article tags. Start directly with <h2>.

BEGIN IMPROVING SECTION NOW.`;

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
                                "x-api-key": apiKey,
                                "anthropic-version": "2023-06-01",
                            },
                            body: JSON.stringify({
                                model: "claude-3-5-sonnet-20241022",
                                max_tokens: 2000,
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                            }),
                        });
                    } else if (llmProvider === "openai") {
                        response = await fetch("https://api.openai.com/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${apiKey}`,
                            },
                            body: JSON.stringify({
                                model: "gpt-4o",
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                            }),
                        });
                    } else if (llmProvider === "gemini") {
                        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
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
                                Authorization: `Bearer ${apiKey}`,
                            },
                            body: JSON.stringify({
                                model: "grok-2-latest",
                                messages: [{ role: "user", content: prompt }],
                                stream: true,
                            }),
                        });
                    } else if (llmProvider === "openrouter") {
                        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${apiKey}`,
                                "HTTP-Referer": "https://recuvix.com",
                                "X-OpenRouter-Title": "Recuvix",
                            },
                            body: JSON.stringify({
                                model: "openai/gpt-4o",
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
                                    } else if (llmProvider === "openai" || llmProvider === "grok" || llmProvider === "openrouter") {
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
                                    // Silent
                                }
                            }
                        }
                    }

                    const wordCount = fullGeneratedText.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", wordCount })}\n\n`));
                    controller.close();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e: any) {
                    console.error("SSE Stream Error:", e);
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: e.message })}\n\n`));
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Improve Section API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to initiate section improvement" }, { status: 500 });
    }
}
