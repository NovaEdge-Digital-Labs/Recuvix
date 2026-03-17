import { z } from "zod";

export const MultilingualGenerateSchema = z.object({
    llmProvider: z.string().optional().nullable(),
    apiKey: z.string().optional().nullable(),
    topic: z.string().min(1, "Topic is required"),
    languageCode: z.string().min(2, "Language code is required"),
    country: z.string().min(1, "Country is required"),
    tone: z.string().min(1, "Tone is required"),
    wordCount: z.number().int().min(100).max(10000).default(1500),
    focusKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).optional().default([]),
    approvedOutline: z.object({
        h1: z.string(),
        h2s: z.array(z.string()),
        focusKeyword: z.string(),
    }).optional(),
    authorDetails: z.object({
        name: z.string(),
        website: z.string(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        youtube: z.string().optional(),
        xHandle: z.string().optional(),
    }).optional(),
    competitorBriefInstructions: z.string().optional(),
});

export type MultilingualGenerateRequest = z.infer<typeof MultilingualGenerateSchema>;
