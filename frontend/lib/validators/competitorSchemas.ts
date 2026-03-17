import { z } from 'zod';

export const scrapeRequestSchema = z.object({
    url: z.string().url().startsWith('https://').max(2048),
});

export const scrapedDataSchema = z.object({
    url: z.string(),
    title: z.string(),
    metaDescription: z.string(),
    h1: z.string(),
    h2s: z.array(z.string()),
    h3s: z.array(z.string()),
    wordCount: z.number(),
    paragraphCount: z.number(),
    imageCount: z.number(),
    internalLinks: z.number(),
    externalLinks: z.number(),
    hasSchemaMarkup: z.boolean(),
    schemaTypes: z.array(z.string()),
    publishDate: z.string().nullable(),
    author: z.string().nullable(),
    contentText: z.string(),
    readingTimeMinutes: z.number(),
    hasFaq: z.boolean(),
    hasTable: z.boolean(),
    hasVideo: z.boolean(),
    hasCodeBlock: z.boolean(),
    scrapedAt: z.string(),
});

export const analyzeRequestSchema = z.object({
    llmProvider: z.enum(['claude', 'openai', 'gemini', 'grok']),
    apiKey: z.string().min(1),
    scrapeData: scrapedDataSchema,
    targetCountry: z.string(),
    userNiche: z.string().optional(),
});

export const analysisResponseSchema = z.object({
    targetKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()),
    contentStrengths: z.array(z.string()),
    contentWeaknesses: z.array(z.string()),
    structuralGaps: z.array(z.string()),
    eeatScore: z.object({
        experience: z.number().min(0).max(25),
        expertise: z.number().min(0).max(25),
        authoritativeness: z.number().min(0).max(25),
        trustworthiness: z.number().min(0).max(25),
        total: z.number().min(0).max(100),
    }),
    searchIntentMatch: z.enum(['Strong', 'Partial', 'Weak']),
    contentFreshness: z.enum(['Fresh', 'Aging', 'Outdated', 'Unknown']),
    uniqueValueGaps: z.array(z.string()),
    questionsMissed: z.array(z.string()),
    competitorScore: z.number().min(0).max(100),
    opportunityScore: z.number().min(0).max(100),
    opportunityReason: z.string(),
});

export const briefRequestSchema = z.object({
    llmProvider: z.enum(['claude', 'openai', 'gemini', 'grok']),
    apiKey: z.string().min(1),
    scrapeData: scrapedDataSchema,
    analysis: analysisResponseSchema,
    targetCountry: z.string(),
    userTone: z.string().optional(),
    userWordCount: z.number().optional(),
});

export const briefResponseSchema = z.object({
    superiorTitle: z.string(),
    focusKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),
    targetWordCount: z.number(),
    outline: z.array(z.object({
        id: z.string(),
        h2: z.string(),
        instructions: z.string(),
        competitorHas: z.boolean(),
        priority: z.enum(['Must', 'Should', 'Could']),
    })),
    uniqueAngles: z.array(z.string()),
    dataToInclude: z.array(z.string()),
    toneInstructions: z.string(),
    avoidList: z.array(z.string()),
    estimatedRankingTime: z.string(),
    winStrategy: z.string(),
});
