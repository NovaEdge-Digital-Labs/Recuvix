import { NextRequest, NextResponse } from "next/server";
import { bulkGenerateSingleSchema } from "@/lib/validators/bulkSchemas";
import { generateOutline } from "@/lib/services/outlineService";
import { buildBlogPrompt, buildSystemInstruction } from "@/lib/prompts/promptBuilder";
import { processImagesInMarkdown, generateThumbnail, generateSeoMeta } from "@/lib/utils/blogProcessor";
import { marked } from "marked";

import { resolveLLMKey } from "@/lib/wl/tenantKeyResolver";

export const maxDuration = 300; // Extend timeout for bulk generation

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const stepsCompleted: string[] = [];
    const tenantId = req.headers.get('x-recuvix-tenant');

    let body: any = null;
    try {
        body = await req.json();
        const validation = bulkGenerateSingleSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { llmProvider, apiKey: userApiKey, topic, settings, authorDetails, logoUrl, userImageUrl, colorThemeUrl } = validation.data;

        // Resolve the actual key to use (User BYOK > Tenant Key > Platform Key)
        const { key: resolvedKey, source: keySource } = await resolveLLMKey(
            llmProvider,
            tenantId,
            userApiKey
        );

        // STEP 1: Generate Outline
        let approvedOutline = topic.approvedOutline;
        if (settings.includeOutlinePreview && !approvedOutline) {
            try {
                const outlineResponse = await generateOutline({
                    llmProvider,
                    apiKey: resolvedKey,
                    topic: topic.topic,
                    country: topic.country || settings.country,
                    tone: topic.tone || settings.tone,
                    wordCount: topic.wordCount || settings.wordCount,
                    focusKeyword: topic.focusKeyword,
                    secondaryKeywords: topic.secondaryKeywords,
                    existingH2s: [],
                });
                approvedOutline = {
                    h1: outlineResponse.h1,
                    h2s: outlineResponse.h2s.map(h => h.text),
                    focusKeyword: outlineResponse.focusKeyword
                };
                stepsCompleted.push("outline");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.warn("Bulk Outline generation failed, continuing without outline:", error);
            }
        }

        // STEP 2: Generate Blog
        const blogFormData = {
            topic: topic.topic,
            focusKeyword: topic.focusKeyword || "",
            country: topic.country || settings.country,
            tone: topic.tone || settings.tone,
            customTone: "",
            wordCount: topic.wordCount || settings.wordCount,
            authorName: authorDetails?.name || "",
            authorBio: "", // Handle if needed
            userPhotoUrl: userImageUrl || null,
            logoUrl: logoUrl || null,
            colorThemeUrl: colorThemeUrl || null,
            outputFormat: settings.outputFormat,
            websiteUrl: authorDetails?.website || "https://recuvix.in",
            companyName: "", // Handle if needed
            isMultilingual: false,
            targetLanguages: [],
        };

        const prompt = buildBlogPrompt({ ...blogFormData, approvedOutline, focusKeyword: topic.focusKeyword || "" });
        const systemInstruction = buildSystemInstruction();

        // Sequential LLM call (not streaming for bulk backend route)
        let rawMarkdown = "";

        // We reuse the provider logic but call it normally instead of streaming
        // For simplicity in this route, we'll use a direct fetch or reuse service if it exists.
        // Assuming we need a non-streaming way to call LLMs.
        rawMarkdown = await callLLM(llmProvider, resolvedKey, prompt, systemInstruction);
        stepsCompleted.push("writing");

        // STEP 3: Fetch Images
        const finalMarkdown = await processImagesInMarkdown(rawMarkdown, {
            ai: settings.includeAiImages,
            stock: settings.includeStockImages
        }, blogFormData.country);
        stepsCompleted.push("images");

        // STEP 4: Generate Thumbnail
        let thumbnailUrl: string | null = null;
        if (settings.includeThumbnail) {
            try {
                // We need a non-streaming version of generateThumbnail or simulate a stream
                // For now, let's assume we can mock the stream completion for services that require it
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mockStreamCompletion = async (options: any) => {
                    const text = await callLLM(llmProvider, resolvedKey, options.prompt, options.systemInstruction);
                    options.onDone(text);
                };

                const titleMatch = finalMarkdown.match(/^#\s+(.*)/m);
                const title = titleMatch ? titleMatch[1] : topic.topic;

                thumbnailUrl = await generateThumbnail(blogFormData, title, mockStreamCompletion);
                if (thumbnailUrl) stepsCompleted.push("thumbnail");
            } catch (error) {
                console.warn("Bulk Thumbnail generation failed:", error);
            }
        }

        // STEP 5: Generate SEO Meta
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let seoMeta: any = null;
        if (settings.includeSeoPack) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mockStreamCompletion = async (options: any) => {
                    const text = await callLLM(llmProvider, resolvedKey, options.prompt, options.systemInstruction);
                    options.onDone(text);
                };
                seoMeta = await generateSeoMeta(finalMarkdown, blogFormData, thumbnailUrl, mockStreamCompletion);
                if (seoMeta) stepsCompleted.push("seoPack");
            } catch (error) {
                console.warn("Bulk SEO Meta generation failed:", error);
            }
        }

        // STEP 6: Package Output
        const parsedHtml = await marked.parse(finalMarkdown);
        let packagedContent = "";
        if (settings.outputFormat === "HTML") {
            packagedContent = parsedHtml; // Simplified, in practice wrap in full doc
        } else if (settings.outputFormat === "Markdown") {
            packagedContent = finalMarkdown;
        } else {
            packagedContent = finalMarkdown; // XML logic
        }
        stepsCompleted.push("packaging");

        const durationSeconds = Math.floor((Date.now() - startTime) / 1000);

        return NextResponse.json({
            success: true,
            topicId: topic.id,
            blogHtml: parsedHtml,
            blogMarkdown: finalMarkdown,
            packagedContent,
            thumbnailUrl,
            seoMeta,
            wordCount: finalMarkdown.split(/\s+/).length,
            durationSeconds,
            stepsCompleted,
            error: null,
            errorStep: null
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Bulk Generate Single Error:", error);

        const isRateLimit = error.message?.includes("Rate limited") || error.status === 429;

        if (isRateLimit) {
            return NextResponse.json({
                success: false,
                error: "RATE_LIMIT",
                retryAfterSeconds: 60,
                topicId: body?.topic?.id
            }, { status: 429 });
        }

        return NextResponse.json({
            success: false,
            topicId: body?.topic?.id,
            error: error.message || "Internal server error",
            errorStep: stepsCompleted[stepsCompleted.length - 1] || "validation"
        }, { status: 500 });
    }
}

async function callLLM(provider: string, apiKey: string, prompt: string, systemInstruction: string): Promise<string> {
    // Reusing logic from outlineService.ts but generalized
    let response: Response;
    if (provider === "claude") {
        response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 4000,
                system: systemInstruction,
                messages: [{ role: "user", content: prompt }],
            }),
        });
    } else if (provider === "openai") {
        response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt }
                ],
            }),
        });
    } else if (provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });
    } else if (provider === "grok") {
        response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "grok-3",
                messages: [
                    { role: "system", content: systemInstruction },
                    { role: "user", content: prompt }
                ],
            }),
        });
    } else {
        throw new Error("Unsupported LLM provider");
    }

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`LLM Error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    if (provider === "claude") return data.content[0].text;
    if (provider === "openai" || provider === "grok") return data.choices[0].message.content;
    if (provider === "gemini") return data.candidates[0].content.parts[0].text;

    return "";
}
