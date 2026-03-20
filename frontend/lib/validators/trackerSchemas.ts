import { z } from "zod";

export const ExchangeTokenSchema = z.object({
    code: z.string().min(1, "OAuth code is required"),
    redirectUri: z.string().url("Valid redirect URI is required"),
});

export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

export const GSCBaseSchema = z.object({
    accessToken: z.string().min(1, "Access token is required"),
});

export const GSCSitesSchema = GSCBaseSchema;

export const GSCPerformanceSchema = GSCBaseSchema.extend({
    siteUrl: z.string().min(1, "Site URL is required"),
    pageUrl: z.string().url("Valid page URL is required").optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
    dimensions: z.array(z.string()).default(["query", "page", "date"]),
    rowLimit: z.number().int().min(1).max(25000).optional().default(100),
});

export const GSCKeywordsSchema = GSCBaseSchema.extend({
    siteUrl: z.string().min(1, "Site URL is required"),
    pageUrl: z.string().url("Valid page URL is required"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
    rowLimit: z.number().int().min(1).max(1000).optional().default(50),
});

export const TrackerAnalyzeSchema = z.object({
    llmProvider: z.enum(["claude", "openai", "gemini", "grok", "openrouter"]),
    apiKey: z.string().min(1, "API key is required"),
    blogTitle: z.string().min(1, "Blog title is required"),
    blogUrl: z.string().url("Valid blog URL is required"),
    focusKeyword: z.string().min(1, "Focus keyword is required"),
    topKeywords: z.array(z.object({
        keyword: z.string(),
        position: z.number(),
        impressions: z.number(),
        clicks: z.number(),
        ctr: z.number(),
        trend: z.string(),
    })).max(10),
    overallStats: z.object({
        totalClicks: z.number(),
        totalImpressions: z.number(),
        avgCtr: z.number(),
        avgPosition: z.number(),
        dateRange: z.string(),
    }),
    country: z.string().optional().default("Global"),
});
