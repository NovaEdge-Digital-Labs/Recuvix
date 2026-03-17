import { nanoid } from 'nanoid';

export interface ScrapedData {
    url: string;
    title: string;
    metaDescription: string;
    h1: string;
    h2s: string[];
    h3s: string[];
    wordCount: number;
    paragraphCount: number;
    imageCount: number;
    internalLinks: number;
    externalLinks: number;
    hasSchemaMarkup: boolean;
    schemaTypes: string[];
    publishDate: string | null;
    author: string | null;
    contentText: string;
    readingTimeMinutes: number;
    hasFaq: boolean;
    hasTable: boolean;
    hasVideo: boolean;
    hasCodeBlock: boolean;
    scrapedAt: string;
}

export interface CompetitorAnalysis {
    targetKeywords: string[];
    missingKeywords: string[];
    contentStrengths: string[];
    contentWeaknesses: string[];
    structuralGaps: string[];
    eeatScore: {
        experience: number;
        expertise: number;
        authoritativeness: number;
        trustworthiness: number;
        total: number;
    };
    searchIntentMatch: "Strong" | "Partial" | "Weak";
    contentFreshness: "Fresh" | "Aging" | "Outdated" | "Unknown";
    uniqueValueGaps: string[];
    questionsMissed: string[];
    competitorScore: number;
    opportunityScore: number;
    opportunityReason: string;
}

export interface CompetitorBrief {
    superiorTitle: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    targetWordCount: number;
    outline: Array<{
        id: string;
        h2: string;
        instructions: string;
        competitorHas: boolean;
        priority: "Must" | "Should" | "Could";
    }>;
    uniqueAngles: string[];
    dataToInclude: string[];
    toneInstructions: string;
    avoidList: string[];
    estimatedRankingTime: string;
    winStrategy: string;
}

async function callLLM(provider: string, apiKey: string, prompt: string): Promise<string> {
    let response: Response;
    let resultText: string;

    if (provider === "claude") {
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
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            }),
        });
    } else if (provider === "gemini") {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" },
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
                model: "grok-2-latest",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
            }),
        });
    } else {
        throw new Error("Unsupported LLM provider");
    }

    if (response.status === 401) throw new Error("Invalid API key");
    if (response.status === 429) throw new Error("Rate limit hit. Try again.");
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (provider === "claude") {
        resultText = data.content[0].text;
    } else if (provider === "openai" || provider === "grok") {
        resultText = data.choices[0].message.content;
    } else if (provider === "gemini") {
        resultText = data.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Failed to parse LLM response");
    }

    return resultText.replace(/```json/g, "").replace(/```/g, "").trim();
}

export async function analyzeCompetitor(params: {
    llmProvider: string;
    apiKey: string;
    scrapeData: ScrapedData;
    targetCountry: string;
    userNiche?: string;
}): Promise<CompetitorAnalysis> {
    const { scrapeData, targetCountry, userNiche } = params;

    const analysisPrompt = `
You are a senior SEO content strategist and competitive intelligence analyst. Your job is to perform a deep analysis of a competitor's blog post and identify every opportunity to create superior content that will outrank it.

COMPETITOR PAGE DATA:
URL: ${scrapeData.url}
Title: ${scrapeData.title}
Meta Description: ${scrapeData.metaDescription}
H1: ${scrapeData.h1}
H2 Sections: ${scrapeData.h2s.join(' | ')}
H3 Sections (first 10): ${scrapeData.h3s.slice(0, 10).join(' | ')}
Word Count: ${scrapeData.wordCount}
Reading Time: ${scrapeData.readingTimeMinutes} minutes
Images: ${scrapeData.imageCount}
Internal Links: ${scrapeData.internalLinks}
External Links: ${scrapeData.externalLinks}
Has Schema Markup: ${scrapeData.hasSchemaMarkup} (${scrapeData.schemaTypes.join(', ')})
Has FAQ Section: ${scrapeData.hasFaq}
Has Comparison Table: ${scrapeData.hasTable}
Has Video: ${scrapeData.hasVideo}
Published: ${scrapeData.publishDate || 'Unknown'}
Author: ${scrapeData.author || 'Unknown'}

CONTENT SAMPLE (first 8000 chars):
${scrapeData.contentText.slice(0, 8000)}

TARGET COUNTRY: ${targetCountry}
${userNiche ? "USER'S BLOG NICHE: " + userNiche : ""}

Perform a comprehensive competitive content analysis.

SCORING RULES:
- competitorScore (0-100): How good is their content RIGHT NOW?
  90-100: Exceptional, very hard to beat
  70-89: Strong, beatable with effort
  50-69: Average, clear gaps to exploit
  30-49: Weak, many opportunities
  0-29: Poor quality, easy to outrank

- opportunityScore (0-100): How easy is it to create something significantly better?
  80-100: Big opportunity, many gaps
  60-79: Good opportunity, some clear wins
  40-59: Moderate opportunity
  20-39: Tough competition
  0-19: Very hard to beat

- E-E-A-T scoring (each 0-25):
  Experience: Do they show first-hand experience?
  Expertise: Do they demonstrate deep subject knowledge?
  Authoritativeness: Are they authoritative on this topic?
  Trustworthiness: Do they cite sources, show credentials?

Be SPECIFIC in all arrays — generic observations are useless.
Every item in weaknesses, gaps, and questions must be actionable and specific to THIS page.

Respond ONLY with valid JSON. No markdown, no explanation, no code fences.

{
  "targetKeywords": ["primary keyword", "secondary keyword", ...],
  "missingKeywords": ["keyword they should target but don't", ...],
  "contentStrengths": ["Specific strength"],
  "contentWeaknesses": ["Specific weakness"],
  "structuralGaps": ["Missing element"],
  "eeatScore": {
    "experience": 15,
    "expertise": 18,
    "authoritativeness": 12,
    "trustworthiness": 10,
    "total": 55
  },
  "searchIntentMatch": "Partial",
  "contentFreshness": "Aging",
  "uniqueValueGaps": ["Opportunity"],
  "questionsMissed": ["Question not answered"],
  "competitorScore": 62,
  "opportunityScore": 74,
  "opportunityReason": "Specific reason"
}
`;

    const result = await callLLM(params.llmProvider, params.apiKey, analysisPrompt);
    return JSON.parse(result);
}

export async function generateCompetitorBrief(params: {
    llmProvider: string;
    apiKey: string;
    scrapeData: ScrapedData;
    analysis: CompetitorAnalysis;
    targetCountry: string;
    userTone?: string;
    userWordCount?: number;
}): Promise<CompetitorBrief> {
    const { scrapeData, analysis, targetCountry, userTone, userWordCount } = params;

    const briefPrompt = `
You are an expert SEO content strategist. Based on a competitor analysis, create a comprehensive brief for a blog post that will definitively outrank the competitor.

COMPETITOR PAGE:
Title: ${scrapeData.title}
H1: ${scrapeData.h1}
Word Count: ${scrapeData.wordCount}
H2 Structure: 
${scrapeData.h2s.map((h, i) => (i + 1) + '. ' + h).join('\n')}

ANALYSIS RESULTS:
Competitor Score: ${analysis.competitorScore}/100
Opportunity Score: ${analysis.opportunityScore}/100
Key Weaknesses: ${analysis.contentWeaknesses.join('; ')}
Missing Keywords: ${analysis.missingKeywords.join(', ')}
Questions Not Answered: ${analysis.questionsMissed.join('; ')}
Structural Gaps: ${analysis.structuralGaps.join('; ')}
Unique Value Gaps: ${analysis.uniqueValueGaps.join('; ')}
E-E-A-T Weaknesses: Score was ${analysis.eeatScore.total}/100

TARGET COUNTRY: ${targetCountry}
${userTone ? "PREFERRED TONE: " + userTone : ""}

TARGET WORD COUNT: ${userWordCount || Math.ceil(scrapeData.wordCount * 1.35)}
(must be at least 30% more than competitor's ${scrapeData.wordCount} words)

Create a brief that will produce content clearly superior to the competitor. Every section must address specific gaps found.

BRIEF REQUIREMENTS:
1. superiorTitle: Must be more compelling AND more keyword-rich than competitor's "${scrapeData.title}".
2. Each outline section must have specific instructions.
3. winStrategy: A clear paragraph explaining EXACTLY how and why this brief will produce content that outranks the competitor.
4. estimatedRankingTime: Be realistic based on opportunity score.

Respond ONLY with valid JSON. No markdown, no code fences.

{
  "superiorTitle": "Better title",
  "focusKeyword": "primary keyword",
  "secondaryKeywords": ["kw1", "kw2"],
  "targetWordCount": 2400,
  "outline": [
    {
      "h2": "Section heading",
      "instructions": "Specific instructions",
      "competitorHas": true,
      "priority": "Must"
    }
  ],
  "uniqueAngles": ["Specific angle"],
  "dataToInclude": ["Specific data"],
  "toneInstructions": "Specific instructions",
  "avoidList": ["Mistake to avoid"],
  "estimatedRankingTime": "3-5 months",
  "winStrategy": "Strategy text"
}
`;

    const resultArr = await callLLM(params.llmProvider, params.apiKey, briefPrompt);
    const brief = JSON.parse(resultArr);

    // Add nanoid to each outline section
    brief.outline = brief.outline.map((section: { h2: string; instructions: string; competitorHas: boolean; priority: string }) => ({
        ...section,
        id: nanoid(),
    }));

    return brief;
}
