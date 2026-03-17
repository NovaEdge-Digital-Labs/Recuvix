import { NextResponse } from "next/server";
import { TrackerAnalyzeSchema } from "@/lib/validators/trackerSchemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = TrackerAnalyzeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
        }

        const {
            llmProvider,
            apiKey,
            blogTitle,
            blogUrl,
            focusKeyword,
            topKeywords,
            overallStats,
            country,
        } = result.data;

        const keywordsTable = topKeywords
            .map(
                (k) =>
                    `| ${k.keyword} | ${k.position.toFixed(1)} | ${k.impressions} | ${k.clicks} | ${(k.ctr * 100).toFixed(1)}% | ${k.trend} |`
            )
            .join("\n");

        const prompt = `
You are an expert SEO analyst. Analyze this blog's Google Search Console performance data and provide specific, actionable improvement suggestions.

Blog: ${blogTitle}
URL: ${blogUrl}
Focus Keyword: ${focusKeyword}
Country: ${country}
Date Range: ${overallStats.dateRange}

Overall Performance:
- Total Clicks: ${overallStats.totalClicks}
- Total Impressions: ${overallStats.totalImpressions}
- Average CTR: ${(overallStats.avgCtr * 100).toFixed(2)}%
- Average Position: ${overallStats.avgPosition.toFixed(2)}

Top Keywords Driving Traffic:
| Keyword | Position | Impressions | Clicks | CTR | Trend |
|---------|----------|-------------|--------|-----|-------|
${keywordsTable}

Analyze this data and respond with ONLY a valid JSON object (no markdown, no explanation, no code fences) in this exact structure:
{
  "overallScore": number (0-100, overall SEO health score),
  "scoreLabel": "Excellent|Good|Needs Work|Poor",
  "summary": "2-3 sentence plain English summary of performance",
  "quickWins": [
    {
      "title": "short action title",
      "description": "specific actionable step",
      "impact": "High|Medium|Low",
      "effort": "Easy|Medium|Hard",
      "type": "title|meta|content|internal_links|ctr|speed"
    }
  ],
  "keywordOpportunities": [
    {
      "keyword": "keyword string",
      "currentPosition": number,
      "opportunity": "specific suggestion for this keyword",
      "potentialTrafficGain": "Low|Medium|High"
    }
  ],
  "ctrOptimization": {
    "currentCtr": number,
    "industryBenchmark": number,
    "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "contentGaps": ["gap 1", "gap 2", "gap 3"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}
`;

        let responseText = "";

        if (llmProvider === "claude") {
            const resp = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20240620",
                    max_tokens: 4096,
                    messages: [{ role: "user", content: prompt }],
                }),
            });
            if (!resp.ok) throw new Error(`Claude API error: ${resp.status}`);
            const data = await resp.json();
            responseText = data.content[0].text;
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
                    response_format: { type: "json_object" },
                }),
            });
            if (!resp.ok) throw new Error(`OpenAI API error: ${resp.status}`);
            const data = await resp.json();
            responseText = data.choices[0].message.content;
        } else if (llmProvider === "gemini") {
            const resp = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" },
                    }),
                }
            );
            if (!resp.ok) throw new Error(`Gemini API error: ${resp.status}`);
            const data = await resp.json();
            responseText = data.candidates[0].content.parts[0].text;
        } else if (llmProvider === "grok") {
            const resp = await fetch("https://api.x.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "grok-beta",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" },
                }),
            });
            if (!resp.ok) throw new Error(`Grok API error: ${resp.status}`);
            const data = await resp.json();
            responseText = data.choices[0].message.content;
        }

        try {
            // Clean up response text if LLM wrapped it in code blocks despite instructions
            let cleaned = responseText.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7, cleaned.length - 3).trim();
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3, cleaned.length - 3).trim();
            }

            const analysis = JSON.parse(cleaned);
            return NextResponse.json(analysis);
        } catch {
            console.error("Failed to parse LLM response:", responseText);
            return NextResponse.json({ error: "AI analysis failed to return valid JSON" }, { status: 502 });
        }
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error("AI Analysis error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
