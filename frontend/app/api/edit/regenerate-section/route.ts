import { NextRequest, NextResponse } from "next/server";
import { regenerateSectionSchema } from "@/lib/validators/editSchemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = regenerateSectionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid request body", details: validation.error.format() }, { status: 400 });
        }

        const {
            llmProvider,
            apiKey,
            blogTopic,
            fullBlogContext,
            sectionH2,
            currentSectionHtml,
            instruction,
            country,
            tone,
            focusKeyword,
            sectionPosition,
            totalSections,
            action,
        } = validation.data;

        let actionInstruction = "";
        if (action === "rewrite") {
            actionInstruction = `USER INSTRUCTION: ${instruction}`;
        } else if (action === "expand") {
            actionInstruction = `Make this section longer and more detailed. Add 2-3 more paragraphs. Add specific examples, data points, or step-by-step details. Target: double the current word count of this section.`;
        } else if (action === "simplify") {
            actionInstruction = `Make this section shorter and simpler. Remove jargon. Use shorter sentences. Aim for half the current word count while keeping the key points.`;
        } else if (action === "tone_change") {
            actionInstruction = `Rewrite this section in a ${instruction} tone. Keep all the information but change how it is expressed.`;
        }

        const prompt = `You are an expert SEO content writer. You are rewriting ONE specific section of a blog post.

BLOG TOPIC: ${blogTopic}
FOCUS KEYWORD: ${focusKeyword}
TARGET COUNTRY: ${country}
CURRENT TONE: ${tone}

SECTION TO REWRITE:
Heading: ${sectionH2}
Position: Section ${sectionPosition} of ${totalSections}

CURRENT SECTION CONTENT:
${currentSectionHtml}

ACTION: ${action}
${actionInstruction}

BLOG CONTEXT (surrounding content for consistency):
${fullBlogContext}

CRITICAL RULES:
1. Return ONLY the HTML for this one section
2. Start with the H2 heading: <h2>...</h2>
3. End after the last paragraph of this section
4. Do NOT include the next section or any other section
5. Keep the same H2 heading text EXACTLY as provided unless the instruction explicitly says to change it
6. NO EMOJIS
7. Maintain consistent tone with the rest of the blog
8. If the section contains a table or list, preserve that element unless the instruction says to change it
9. Keep any [INTERNALLINK: ...] placeholders as-is
10. Section must fit naturally between the sections before and after it — do not repeat content from context

OUTPUT FORMAT: Return ONLY the HTML for this section. No style tags. No article tags. Start directly with <h2>.

BEGIN REWRITING SECTION NOW.`;

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
                                    // Silent
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
        console.error("Regenerate Section API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to initiate section regeneration" }, { status: 500 });
    }
}
