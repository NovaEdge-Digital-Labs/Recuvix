import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { calendarSuggestionsRequestSchema } from "@/lib/validators/calendarSchemas";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = calendarSuggestionsRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
        }

        const {
            llmProvider,
            apiKey,
            month,
            year,
            country,
            niche,
            existingTopics,
            publishingFrequency,
            count,
            includeSeasonality,
            includeTrending,
            existingFocusKeywords
        } = validation.data;

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[month - 1];

        const suggestionPrompt = `
You are an expert content strategist and SEO specialist. Generate blog topic suggestions for a content calendar.

PLANNING DETAILS:
Month: ${monthName} ${year}
Country: ${country}
Niche: ${niche}
Number of topics needed: ${count}
Publishing frequency: ${publishingFrequency}

ALREADY PLANNED TOPICS (avoid overlap):
${existingTopics.length > 0 ? existingTopics.join('\n') : 'None yet'}

KEYWORDS ALREADY USED (avoid repeating):
${existingFocusKeywords.length > 0 ? existingFocusKeywords.join(', ') : 'None'}

${includeSeasonality ? `SEASONAL CONTEXT FOR ${monthName} IN ${country}:
Consider: holidays, festivals, events, seasons, school/college schedules, financial year cycles, cricket/sports seasons, shopping seasons, weather patterns, and annual business cycles specific to ${country} in ${monthName}.` : ''}

${includeTrending ? `TRENDING CONSIDERATION:
Suggest 1-2 topics that are likely to be trending or highly searched in ${country} during ${monthName} ${year} based on typical yearly search patterns for this niche.` : ''}

For each topic, think like a senior SEO strategist:
- What are people in ${country} searching for in ${monthName} related to ${niche}?
- What topics have strong seasonal demand?
- What topics would establish authority in ${niche}?
- What topics are underserved (lower competition)?

REQUIREMENTS:
1. Topics must be diverse (different angles, different content types)
2. Each must be specific — not generic
3. Focus keywords must be ones people ACTUALLY search for in ${country}
4. Include a mix of: informational (60%), commercial investigation (30%), trending (10%)
5. NO EMOJIS anywhere in the output
6. Spreads suggestedDate across the month evenly. format: YYYY-MM-DD

Respond ONLY with valid JSON array.
No markdown, no code fences. Start with [.

[
  {
    "title": "Complete blog post title",
    "topic": "Core topic description",
    "focusKeyword": "primary keyword phrase",
    "secondaryKeywords": ["kw1", "kw2", "kw3"],
    "contentType": "blog|listicle|how_to|comparison|case_study|ultimate_guide|news_trend",
    "estimatedSearchVolume": "1K-10K/month",
    "estimatedDifficulty": "Easy|Medium|Hard",
    "suggestedDate": "YYYY-MM-DD",
    "seasonalityNote": "Why timely in ${monthName} or null if not seasonal",
    "aiSuggestionReason": "One sentence: why this topic will perform well",
    "priority": "low|medium|high|urgent"
  }
]
`;

        let response: Response;
        let resultText: string;

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
                    max_tokens: 3000,
                    messages: [{ role: "user", content: suggestionPrompt }],
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
                    messages: [{ role: "user", content: suggestionPrompt }],
                }),
            });
        } else if (llmProvider === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: suggestionPrompt }] }],
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
                    messages: [{ role: "user", content: suggestionPrompt }],
                }),
            });
        } else {
            throw new Error("Unsupported LLM provider");
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (llmProvider === "claude") {
            resultText = data.content[0].text;
        } else if (llmProvider === "openai" || llmProvider === "grok") {
            resultText = data.choices[0].message.content;
        } else if (llmProvider === "gemini") {
            resultText = data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Unknown provider");
        }

        // Clean JSON
        resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
        const suggestions = JSON.parse(resultText);

        return NextResponse.json({
            suggestions: suggestions.map((s: any) => ({
                ...s,
                id: nanoid()
            }))
        });

    } catch (error: any) {
        console.error("Calendar Suggestions API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate suggestions" }, { status: 500 });
    }
}
