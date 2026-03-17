import { z } from "zod";

export const bulkSettingsSchema = z.object({
    country: z.string().default("United States (US)"),
    tone: z.string().default("Professional & Authoritative"),
    wordCount: z.number().int().min(300).max(5000).default(1500),
    outputFormat: z.enum(["HTML", "Markdown", "XML"]).default("Markdown"),
    includeOutlinePreview: z.boolean().default(true),
    includeAiImages: z.boolean().default(true),
    includeStockImages: z.boolean().default(false),
    includeThumbnail: z.boolean().default(true),
    includeSeoPack: z.boolean().default(true),
    delayBetweenBlogs: z.number().int().min(3).max(60).default(5),
    autoRetryFailed: z.boolean().default(true),
    maxRetries: z.number().int().min(0).max(5).default(2),
    notifyOnComplete: z.boolean().default(false),
});

export const stepStatusSchema = z.object({
    status: z.enum(["pending", "running", "done", "failed", "skipped"]).default("pending"),
    startedAt: z.string().nullable().default(null),
    completedAt: z.string().nullable().default(null),
    error: z.string().nullable().default(null),
});

export const bulkTopicSchema = z.object({
    id: z.string(),
    position: z.number(),
    topic: z.string().min(3),
    focusKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).optional().default([]),
    country: z.string().optional(),
    wordCount: z.number().optional(),
    tone: z.string().optional(),
    notes: z.string().optional(),
    sourceType: z.enum(["manual", "research", "csv", "competitor"]).default("manual"),
    status: z.enum(["queued", "generating", "complete", "failed", "skipped", "paused"]).default("queued"),
    retryCount: z.number().default(0),
    steps: z.object({
        outline: stepStatusSchema,
        writing: stepStatusSchema,
        images: stepStatusSchema,
        thumbnail: stepStatusSchema,
        seoPack: stepStatusSchema,
        packaging: stepStatusSchema,
    }),
    approvedOutline: z.any().nullable().default(null),
    blogHtml: z.string().default(""),
    blogMarkdown: z.string().default(""),
    thumbnailUrl: z.string().default(""),
    seoMeta: z.any().nullable().default(null),
    durationSeconds: z.number().nullable().default(null),
    startedAt: z.string().nullable().default(null),
    completedAt: z.string().nullable().default(null),
    lastError: z.string().nullable().default(null),
    lastErrorStep: z.string().nullable().default(null),
});

export const bulkGenerateSingleSchema = z.object({
    llmProvider: z.enum(["claude", "openai", "gemini", "grok"]),
    apiKey: z.string().min(1),
    topic: bulkTopicSchema,
    settings: bulkSettingsSchema,
    authorDetails: z.object({
        name: z.string().optional(),
        website: z.string().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        youtube: z.string().optional(),
        xHandle: z.string().optional(),
        address: z.string().optional(),
        mobileNumber: z.string().optional(),
    }).optional(),
    logoUrl: z.string().optional(),
    userImageUrl: z.string().optional(),
    colorThemeUrl: z.string().optional(),
});

export type BulkSettings = z.infer<typeof bulkSettingsSchema>;
export type BulkTopic = z.infer<typeof bulkTopicSchema>;
export type BulkGenerateSingleRequest = z.infer<typeof bulkGenerateSingleSchema>;
export type StepStatus = z.infer<typeof stepStatusSchema>;
