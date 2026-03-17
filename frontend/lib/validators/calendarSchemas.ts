import { z } from 'zod';

export const calendarEntrySchema = z.object({
    title: z.string().min(3),
    topic: z.string().min(3),
    scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    scheduledTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional().nullable(),
    focusKeyword: z.string().optional().default(''),
    secondaryKeywords: z.array(z.string()).optional().default([]),
    country: z.string().optional().default('india'),
    targetTone: z.string().optional().default('professional'),
    targetWordCount: z.number().int().positive().optional().default(1500),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
    contentType: z.enum([
        'blog', 'listicle', 'how_to', 'comparison',
        'case_study', 'ultimate_guide', 'news_trend'
    ]).optional().default('blog'),
    category: z.string().optional().nullable(),
    tags: z.array(z.string()).optional().default([]),
    seasonalityNote: z.string().optional().nullable(),
    trendContext: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    workspaceId: z.string().uuid().optional().nullable(),
    assignedTo: z.string().uuid().optional().nullable(),
    researchHistoryId: z.string().uuid().optional().nullable(),
    isAiSuggested: z.boolean().optional().default(false),
    aiSuggestionReason: z.string().optional().nullable(),
    estimatedSearchVolume: z.string().optional().nullable(),
    estimatedDifficulty: z.string().optional().nullable(),
});

export const calendarSettingsSchema = z.object({
    defaultCountry: z.string().optional(),
    defaultPublishingFrequency: z.enum(['daily', '3x_week', 'weekly', 'biweekly', 'monthly']).optional(),
    targetBlogsPerMonth: z.number().int().min(1).max(100).optional(),
    primaryNiche: z.string().optional().nullable(),
    defaultView: z.enum(['month', 'week', 'list']).optional(),
    startDayOfWeek: z.number().int().min(0).max(1).optional(),
    aiSuggestionsEnabled: z.boolean().optional(),
    includeSeasonalTopics: z.boolean().optional(),
    includeTrendingTopics: z.boolean().optional(),
    autoFillGaps: z.boolean().optional(),
    reminderDaysBefore: z.number().int().min(0).max(30).optional(),
});

export const calendarSuggestionsRequestSchema = z.object({
    llmProvider: z.enum(['claude', 'openai', 'gemini', 'grok']),
    apiKey: z.string(),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2020),
    country: z.string(),
    niche: z.string(),
    existingTopics: z.array(z.string()),
    publishingFrequency: z.string(),
    count: z.number().int().positive().max(20),
    includeSeasonality: z.boolean(),
    includeTrending: z.boolean(),
    existingFocusKeywords: z.array(z.string()),
});

export const calendarBulkCreateSchema = z.object({
    entries: z.array(calendarEntrySchema.partial().extend({
        title: z.string(),
        topic: z.string(),
        scheduledDate: z.string(),
    })),
    workspaceId: z.string().uuid().optional().nullable(),
});
