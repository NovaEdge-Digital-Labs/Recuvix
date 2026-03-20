import { ResearchTopicRequest } from "@/lib/validators/researchSchemas";
import { ResearchTopic } from "@/lib/types/research";
import { nanoid } from "nanoid";

export async function generateResearchTopics(params: ResearchTopicRequest): Promise<ResearchTopic[]> {
    const { llmProvider, apiKey, niche, country, contentGoal, existingTopics, difficulty, count } = params;

    const researchPrompt = `
You are an expert SEO strategist and keyword researcher with deep 
knowledge of content marketing and Google search behavior.

Your task is to generate ${count} high-potential blog topic ideas 
for the following:

NICHE: ${niche}
TARGET COUNTRY: ${country}
CONTENT GOAL: ${contentGoal}
DIFFICULTY PREFERENCE: ${difficulty}
${existingTopics && existingTopics.length > 0 ? "TOPICS ALREADY WRITTEN (avoid overlap):\n" + existingTopics.join("\n") : ""}

For each topic, think like a senior SEO strategist:
- What are real people in ${country} actually searching for in 
  this niche RIGHT NOW?
- What keywords have search demand but manageable competition?
- What topics have buying/research intent that aligns with 
  ${contentGoal}?
- What angles haven't been covered well by existing content?

CRITICAL REQUIREMENTS:
1. Topics must be genuinely useful and rankable — not generic
2. Focus keywords must be specific, not broad head terms
3. Search volume estimates must be realistic for ${country}
4. Difficulty must reflect actual SERP competition
5. Each topic must have a unique, differentiated angle
6. Country relevance must be specific — mention actual 
   ${country}-specific context, not generic statements
7. Topics should cover a MIX of content types (listicles, 
   how-to guides, comparisons, case studies, etc.)
8. Secondary keywords must be genuinely related and searchable

Respond ONLY with a valid JSON array. No markdown, no explanation,
no code fences. Start directly with [ and end with ].

Return exactly this structure:
[
  {
    "title": "Complete blog post title (compelling, SEO-optimized)",
    "focusKeyword": "primary keyword phrase (2-5 words)",
    "secondaryKeywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
    "searchVolumeRange": "100-1K/month",
    "difficulty": "Easy|Medium|Hard|Very Hard",
    "difficultyScore": 35,
    "intent": "Informational|Commercial|Transactional|Navigational",
    "estimatedTrafficPotential": "Low|Medium|High|Very High",
    "angle": "The unique angle or hook that makes this rankable",
    "whyItWillRank": "One specific reason this can rank in ${country}",
    "contentType": "Listicle|How-To Guide|Comparison|Case Study|Ultimate Guide|News/Trend",
    "estimatedWordCount": 1800,
    "competitorCount": "Few|Moderate|Many",
    "countryRelevance": "Specific relevance to ${country} market"
  }
]

Search volume range values to use:
"< 100/month" | "100-1K/month" | "1K-10K/month" | 
"10K-100K/month" | "> 100K/month"

Generate all ${count} topics now.
`;

    let response: Response;
    let resultText: string;

    try {
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
                    max_tokens: 4000,
                    messages: [{ role: "user", content: researchPrompt }],
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
                    messages: [{ role: "user", content: researchPrompt }],
                }),
            });
        } else if (llmProvider === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: researchPrompt }] }],
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
                    messages: [{ role: "user", content: researchPrompt }],
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
                    messages: [{ role: "user", content: researchPrompt }],
                }),
            });
        } else {
            throw new Error("Unsupported LLM provider");
        }

        if (response.status === 401) {
            throw new Error("Invalid API key");
        }
        if (response.status === 429) {
            throw new Error("Rate limit hit. Try again.");
        }
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        try {
            if (llmProvider === "claude") {
                resultText = data.content[0].text;
            } else if (llmProvider === "openai" || llmProvider === "grok" || llmProvider === "openrouter") {
                resultText = data.choices[0].message.content;
            } else if (llmProvider === "gemini") {
                resultText = data.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Failed to parse LLM response: Unknown provider or data structure.");
            }
        } catch (err: unknown) {
            console.error("Failed to parse LLM research response:", err);
            return [];
        }

        // Clean JSON in case LLM added backticks
        resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();

        const topics: unknown[] = JSON.parse(resultText);

        return topics.map(topic => ({
            ...(topic as object),
            id: nanoid(),
            selected: false,
            searchVolumeSource: "ai_estimate"
        })) as ResearchTopic[];

    } catch (err: unknown) {
        console.error("LLM Research Topic generation failed:", err);
        throw err;
    }
}
