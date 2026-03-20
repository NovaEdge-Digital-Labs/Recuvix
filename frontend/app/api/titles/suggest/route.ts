import { NextRequest, NextResponse } from "next/server";
import { TitleSuggestRequestSchema } from "@/lib/validators/titleSchemas";
import { nanoid } from "nanoid";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPlatformApiKey } from '@/lib/supabase/platformLlm';
import { resolveLLMKey } from '@/lib/wl/tenantKeyResolver';

export const maxDuration = 30; // Extend to 30s to be safe for LLM response

export async function POST(req: NextRequest) {
    let isManagedCall = false;
    let userId: string | null = null;
    try {
        const bodyText = await req.text();
        if (!bodyText) {
            return NextResponse.json({ error: "Request body cannot be empty" }, { status: 400 });
        }
        const body = JSON.parse(bodyText);
        const result = TitleSuggestRequestSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request data", details: result.error.format() }, { status: 400 });
        }

        let { llmProvider, apiKey } = result.data;
        const { topic, country, count, existingTitle, avoidAngles = [] } = result.data;

        const supabase = await createServerSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!apiKey) {
            if (!session) {
                return NextResponse.json({ error: 'Unauthorized. Please log in or provide an API key.' }, { status: 401 });
            }

            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('credits_balance, managed_mode_enabled')
                .eq('id', session.user.id)
                .single();

            if (!(profile as any)?.managed_mode_enabled) {
                return NextResponse.json({ error: 'Managed mode not enabled' }, { status: 403 });
            }

            if ((profile as any).credits_balance < 1) {
                return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
            }

            llmProvider = llmProvider || "openai";
            const { data: deductResult, error: deductError } = await (supabaseAdmin as any).rpc('deduct_credit', {
                p_user_id: session.user.id,
                p_blog_id: null,
                p_blog_topic: `Title Suggestions: ${topic}`,
                p_llm_provider: llmProvider,
            });

            if (deductError || !(deductResult as any)?.success) {
                return NextResponse.json({ error: (deductResult as any)?.error || 'Credit deduction failed' }, { status: 500 });
            }

            isManagedCall = true;
            userId = session.user.id;

            try {
                apiKey = await getPlatformApiKey(llmProvider);
            } catch (err: any) {
                throw new Error(`Failed to get platform API key: ${err.message}`);
            }
        }

        const tenantId = req.headers.get('x-recuvix-tenant');
        const { key: resolvedKey, source: keySource } = await resolveLLMKey(
            llmProvider || 'openai',
            tenantId,
            apiKey
        );

        if (!llmProvider || !resolvedKey) {
            return NextResponse.json({ error: "Missing LLM Provider or API Key" }, { status: 400 });
        }

        const prompt = `You are an expert SEO content strategist and copywriter specializing in creating blog titles that rank on Google and get high click-through rates.

TOPIC: ${topic}
TARGET COUNTRY: ${country}
NUMBER OF SUGGESTIONS: ${count}
${existingTitle ? `EXISTING TITLE (create alternatives): ${existingTitle}` : ""}
${avoidAngles.length > 0 ? `AVOID THESE ANGLES (already shown): ${avoidAngles.join(", ")}` : ""}

Generate ${count} DISTINCT blog title suggestions. Each title must use a DIFFERENT angle — no two titles should feel similar.

TITLE REQUIREMENTS:
1. Each title must be between 45-65 characters (optimal for Google SERP display — not too short, not truncated)
2. Primary keyword must appear in the first half of the title
3. Include a number in at least 2 of the titles (e.g. "7 Ways", "10 Proven", "5 Common Mistakes")
4. At least one title must be a question format
5. At least one title must be a "How to..." format
6. Titles must feel like a human expert wrote them — specific, concrete, valuable
7. Avoid clickbait — every title must deliver on its promise
8. Include ${country}-specific context in at least 2 titles where it feels natural (not forced)
9. NO emojis in any title

ANGLE VARIETY — use different angles across the 5 titles:
- Listicle: "X Ways/Tips/Strategies/Mistakes/Tools..."
- How-To Guide: "How to [Achieve Result] in [Timeframe]..."
- Ultimate Guide: "The Complete/Ultimate Guide to..."
- Comparison: "[X] vs [Y]: Which is Better for..."
- Question: "What is/Why Does/How Can..."
- Case Study: "How [Brand/Person] [Achieved Result]..."
- Beginner: "[Topic] for Beginners: Start with..."
- Advanced: "Advanced [Topic]: [Specific Technique]..."
- Trending: "[Current Year]'s Best/Top/New..."
- Problem-Solution: "Struggling with [X]? Try These..."

Respond ONLY with valid JSON array. No markdown, no explanation, no code fences. Start with [ and end with ].

[
  {
    "title": "The exact blog title (45-65 chars ideal)",
    "focusKeyword": "2-5 word primary keyword this targets",
    "angle": "Listicle",
    "estimatedSearchIntent": "Informational",
    "whyItWorks": "One sentence: specific reason this title will perform well for this topic and country"
  }
]`;

        let response: Response;
        let modelName = "";

        if (llmProvider === "claude") {
            modelName = "claude-opus-4-5";
            response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": resolvedKey,
                    "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                    model: modelName,
                    max_tokens: 1200,
                    stream: false,
                    messages: [{ role: "user", content: prompt }],
                }),
            });
        } else if (llmProvider === "openai") {
            modelName = "gpt-4o";
            response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: modelName,
                    max_tokens: 1200,
                    stream: false,
                    messages: [{ role: "user", content: prompt }],
                }),
            });
        } else if (llmProvider === "gemini") {
            modelName = "gemini-2.0-flash";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${resolvedKey}`;
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            });
        } else if (llmProvider === "grok") {
            modelName = "grok-3";
            response = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: modelName,
                    max_tokens: 1200,
                    stream: false,
                    messages: [{ role: "user", content: prompt }],
                }),
            });
        } else if (llmProvider === "openrouter") {
            modelName = "openai/gpt-4o";
            response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                    "HTTP-Referer": "https://recuvix.com",
                    "X-OpenRouter-Title": "Recuvix",
                },
                body: JSON.stringify({
                    model: modelName,
                    max_tokens: 1200,
                    stream: false,
                    messages: [{ role: "user", content: prompt }],
                }),
            });
        } else {
            throw new Error("Unsupported LLM provider");
        }

        if (response.status === 401) {
            throw new Error("Invalid API key");
        }
        if (response.status === 429) {
            throw new Error("Rate limited");
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        let resultText: string;

        try {
            if (llmProvider === "claude") {
                resultText = data.content[0].text;
            } else if (llmProvider === "openai" || llmProvider === "grok" || llmProvider === "openrouter") {
                resultText = data.choices[0].message.content;
            } else if (llmProvider === "gemini") {
                resultText = data.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Unknown provider response shape");
            }
        } catch {
            throw new Error("Failed to parse LLM response");
        }

        // Clean JSON string
        let cleanedText = resultText.trim();
        if (cleanedText.includes("```")) {
            const match = cleanedText.match(/\[[\s\S]*\]/);
            if (match) {
                cleanedText = match[0];
            }
        }

        try {
            const suggestions = JSON.parse(cleanedText).map((s: { title: string; focusKeyword: string; angle: string; estimatedSearchIntent: string; whyItWorks: string }) => ({
                ...s,
                id: nanoid(),
            }));

            return NextResponse.json({
                suggestions,
                topic,
                country,
                model: modelName,
            });
        } catch (_e) {
            // Final attempt with regex if JSON.parse fails
            const match = cleanedText.match(/\[[\s\S]*\]/);
            if (match) {
                try {
                    const suggestions = JSON.parse(match[0]).map((s: { title: string; focusKeyword: string; angle: string; estimatedSearchIntent: string; whyItWorks: string }) => ({
                        ...s,
                        id: nanoid(),
                    }));
                    return NextResponse.json({
                        suggestions,
                        topic,
                        country,
                        model: modelName,
                    });
                } catch {
                    throw new Error("Suggestions failed: Invalid JSON structure");
                }
            }
            throw new Error("Suggestions failed: Parsing error");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Title Suggestion Route Error:", error);

        // Refund credit if managed call failed
        if (isManagedCall && userId) {
            try {
                await (supabaseAdmin as any).rpc('add_credits', {
                    p_user_id: userId,
                    p_amount: 1,
                    p_razorpay_payment_id: 'REFUND_TITLE_FAIL',
                    p_razorpay_order_id: 'REFUND',
                    p_razorpay_signature: 'REFUND',
                    p_pack_id: 'refund',
                    p_pack_name: 'Generation Refund',
                    p_amount_paid_inr: 0
                });
            } catch (refundError) {
                console.error("Failed to process refund:", refundError);
            }
        }

        return NextResponse.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
    }
}
