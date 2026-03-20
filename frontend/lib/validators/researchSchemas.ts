import { z } from 'zod';

export const researchTopicRequestSchema = z.object({
    llmProvider: z.enum(['claude', 'openai', 'gemini', 'grok', 'openrouter']),
    apiKey: z.string().min(1, 'API key is required'),
    niche: z.string().min(3, 'Niche is too vague').max(100),
    country: z.string().min(1, 'Country is required'),
    contentGoal: z.enum(['traffic', 'leads', 'sales', 'awareness']),
    existingTopics: z.array(z.string()).optional(),
    difficulty: z.enum(['all', 'easy_only', 'medium_and_below']),
    count: z.number().min(1).max(20).default(10),
});

export const dataForSeoRequestSchema = z.object({
    login: z.string().min(1, 'Login is required'),
    password: z.string().min(1, 'Password is required'),
    keywords: z.array(z.string()).min(1).max(20),
    country: z.string().min(1, 'Country is required'),
    language: z.string().min(1, 'Language is required'),
});

export type ResearchTopicRequest = z.infer<typeof researchTopicRequestSchema>;
export type DataForSeoRequest = z.infer<typeof dataForSeoRequestSchema>;
