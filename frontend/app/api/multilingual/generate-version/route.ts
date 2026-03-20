import { NextResponse } from "next/server";
import { MultilingualGenerateSchema } from "@/lib/validators/multilingualSchemas";
import { LANGUAGES } from "@/lib/config/languageConfig";
import { buildLocalizedBlogPrompt } from "@/lib/multilingual/localizedPromptBuilder";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPlatformApiKey } from '@/lib/supabase/platformLlm';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = MultilingualGenerateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request", details: result.error.format() },
                { status: 400 }
            );
        }

        const {
            topic,
            languageCode,
            country,
            tone,
            wordCount,
            focusKeyword,
            secondaryKeywords,
            approvedOutline,
            authorDetails,
        } = result.data;

        let { llmProvider, apiKey } = result.data;

        const language = LANGUAGES.find((l) => l.code === languageCode);
        if (!language) {
            return NextResponse.json(
                { error: `Unsupported language: ${languageCode}` },
                { status: 400 }
            );
        }

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
                p_blog_topic: `${topic} (${languageCode})`,
                p_llm_provider: llmProvider,
            });

            if (deductError || !(deductResult as any)?.success) {
                return NextResponse.json({ error: (deductResult as any)?.error || 'Credit deduction failed' }, { status: 500 });
            }

            try {
                apiKey = await getPlatformApiKey(llmProvider);
            } catch (err: any) {
                await (supabaseAdmin as any).rpc('add_credits', {
                    p_user_id: session.user.id,
                    p_amount: 1,
                    p_razorpay_payment_id: 'REFUND_MULTIL_FAIL',
                    p_razorpay_order_id: 'REFUND',
                    p_razorpay_signature: 'REFUND',
                    p_pack_id: 'refund',
                    p_pack_name: 'Generation Refund',
                    p_amount_paid_inr: 0
                });
                return NextResponse.json({ error: err.message }, { status: 500 });
            }
        }

        if (!llmProvider || !apiKey) {
            return NextResponse.json({ error: "Missing LLM Provider or API Key" }, { status: 400 });
        }

        const prompt = buildLocalizedBlogPrompt({
            topic,
            language,
            country,
            tone,
            wordCount,
            focusKeyword,
            secondaryKeywords,
            approvedOutline,
            authorDetails,
        });

        let blogHtml = "";

        try {
            if (llmProvider === "claude") {
                const resp = await fetch("https://api.anthropic.com/v1/messages", {
                    method: "POST",
                    headers: {
                        "x-api-key": apiKey,
                        "anthropic-version": "2023-06-01",
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "claude-3-5-sonnet-20241022",
                        max_tokens: 8000,
                        messages: [{ role: "user", content: prompt }],
                    }),
                });
                if (!resp.ok) throw new Error(`Claude API error: ${resp.status}`);
                const data = await resp.json();
                blogHtml = data.content[0].text;
            } else if (llmProvider === "openai") {
                const resp = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "gpt-4o",
                        messages: [{ role: "user", content: prompt }],
                    }),
                });
                if (!resp.ok) throw new Error(`OpenAI API error: ${resp.status}`);
                const data = await resp.json();
                blogHtml = data.choices[0].message.content;
            } else if (llmProvider === "gemini") {
                const resp = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                        }),
                    }
                );
                if (!resp.ok) throw new Error(`Gemini API error: ${resp.status}`);
                const data = await resp.json();
                blogHtml = data.candidates[0].content.parts[0].text;
            } else if (llmProvider === "grok") {
                const resp = await fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "grok-2-latest",
                        messages: [{ role: "user", content: prompt }],
                    }),
                });
                if (!resp.ok) throw new Error(`Grok API error: ${resp.status}`);
                const data = await resp.json();
                blogHtml = data.choices[0].message.content;
            } else if (llmProvider === "openrouter") {
                const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://recuvix.com",
                        "X-OpenRouter-Title": "Recuvix",
                    },
                    body: JSON.stringify({
                        model: "google/gemini-2.0-flash-001",
                        messages: [{ role: "user", content: prompt }],
                        max_tokens: 4000,
                    }),
                });
                if (!resp.ok) throw new Error(`OpenRouter API error: ${resp.status}`);
                const data = await resp.json();
                blogHtml = data.choices[0].message.content;
            }
        } catch (llmError: any) {
            if (session && !result.data.apiKey) {
                await (supabaseAdmin as any).rpc('add_credits', {
                    p_user_id: session.user.id,
                    p_amount: 1,
                    p_razorpay_payment_id: 'REFUND_MULTIL_LLM_FAIL',
                    p_razorpay_order_id: 'REFUND',
                    p_razorpay_signature: 'REFUND',
                    p_pack_id: 'refund',
                    p_pack_name: 'Generation Refund',
                    p_amount_paid_inr: 0
                });
            }
            throw llmError;
        }

        // Clean up response if LLM wrapped it in code blocks
        let cleaned = blogHtml.trim();
        if (cleaned.startsWith("```html")) {
            cleaned = cleaned.substring(7, cleaned.length - 3).trim();
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3, cleaned.length - 3).trim();
        }

        return NextResponse.json({
            blogHtml: cleaned,
            languageCode: language.code,
        });
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error("Multilingual Generation Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
