import { OutlineGenerateRequest } from "@/lib/validators/outlineSchemas";
import { OutlineResponse, H2Item } from "@/lib/types/outline";
import { nanoid } from "nanoid";
import { getPlatformApiKey } from "@/lib/supabase/platformLlm";

function buildOutlinePrompt(params: OutlineGenerateRequest): string {
    const {
        topic,
        country,
        tone,
        wordCount,
        focusKeyword,
        secondaryKeywords = [],
        angle,
        regenerationNote,
        existingH2s = [],
    } = params;

    return `You are an expert SEO content strategist. Your task is to create a precise blog post outline optimized for search rankings.

TOPIC: ${topic}
TARGET COUNTRY: ${country}
TONE: ${tone}
TARGET LENGTH: approximately ${wordCount} words
${focusKeyword ? `FOCUS KEYWORD: ${focusKeyword}` : ""}
${secondaryKeywords.length > 0 ? `SECONDARY KEYWORDS: ${secondaryKeywords.join(", ")}` : ""}
${angle ? `CONTENT ANGLE: ${angle}` : ""}
${regenerationNote ? `SPECIAL INSTRUCTION: ${regenerationNote}` : ""}
${existingH2s.length > 0
            ? `PREVIOUS OUTLINE (create a DIFFERENT structure):\n${existingH2s.map((h, i) => `${i + 1}. ${h}`).join("\n")}`
            : ""
        }

Create an SEO-optimized outline following these rules:

1. H1 TITLE: Must be compelling, contain the focus keyword near the start, and be different from the raw topic input — improve it. Max 65 characters.

2. H2 SECTIONS: Based on the word count, generate the right number:
   - 500-800 words: 4-5 H2s
   - 800-1500 words: 5-7 H2s
   - 1500-2500 words: 7-9 H2s
   - 2500+ words: 9-12 H2s

3. RULES FOR H2s:
   - Each H2 must promise specific, unique value
   - At least 2 H2s must naturally contain a secondary keyword
   - Include one H2 for a comparison table or data section
   - Last H2 must be "Frequently Asked Questions" or similar FAQ section
   - H2s must flow logically — each section builds on the previous
   - NO generic H2s like "Introduction" or "Conclusion" — those are implicit
   - H2s should reflect what someone would search for
   - Be specific: "5 Digital Marketing Tools Under ₹500/Month" is better than "Affordable Tools"

4. COUNTRY CONTEXT: At least 2 H2s should have ${country}-specific framing where natural.

Respond ONLY with valid JSON. No markdown, no explanation, no code fences. Start with { and end with }.

{
  "h1": "The improved, SEO-optimized blog title",
  "focusKeyword": "the primary keyword this blog targets",
  "h2s": [
    "First H2 section title",
    "Second H2 section title",
    "Third H2 section title"
  ],
  "estimatedReadTime": 8,
  "contentStrategy": "One sentence explaining the strategic angle of this outline"
}`;
}

export async function generateOutline(params: OutlineGenerateRequest): Promise<OutlineResponse> {
    const { llmProvider } = params;
    let { apiKey } = params;

    // Support Managed Mode for outlines
    if (!apiKey) {
        apiKey = await getPlatformApiKey(llmProvider);
    }

    const prompt = buildOutlinePrompt(params);

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
                model: "claude-opus-4-5",
                max_tokens: 800,
                stream: false,
                messages: [{ role: "user", content: prompt }],
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
                max_tokens: 800,
                stream: false,
                messages: [{ role: "user", content: prompt }],
            }),
        });
    } else if (llmProvider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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
                model: "grok-3",
                max_tokens: 800,
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
        throw new Error("Rate limited. Try again shortly.");
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
        } else if (llmProvider === "openai" || llmProvider === "grok") {
            resultText = data.choices[0].message.content;
        } else if (llmProvider === "gemini") {
            resultText = data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Unknown provider response shape");
        }
    } catch {
        throw new Error("Failed to parse LLM response");
    }

    // Clean in case the LLM wrapped in backticks
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed: { h1: string; focusKeyword: string; h2s: string[]; estimatedReadTime: number; contentStrategy: string };
    try {
        parsed = JSON.parse(resultText);
    } catch {
        const raw = resultText.slice(0, 200);
        throw new Error(`JSON_PARSE_FAILURE:${raw}`);
    }

    const h2sWithMeta: H2Item[] = (parsed.h2s || []).map((text: string) => ({
        id: nanoid(),
        text,
        locked: false,
    }));

    return {
        h1: parsed.h1,
        focusKeyword: parsed.focusKeyword || params.focusKeyword || "",
        h2s: h2sWithMeta,
        estimatedReadTime: parsed.estimatedReadTime || Math.ceil(params.wordCount / 200),
        contentStrategy: parsed.contentStrategy || "",
    };
}
