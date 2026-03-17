import { z } from 'zod';

export const stockImageSchema = z.object({
    topic: z.string().min(1, 'Topic is required').max(150),
    country: z.string().toLowerCase().default('usa'),
    count: z.number().int().min(1).max(6).default(3),
    preferSource: z.enum(['unsplash', 'pexels', 'both']).default('both'),
});

export const generatedImageSchema = z.object({
    prompt: z.string().min(3, 'Prompt is required').max(500),
    country: z.string().toLowerCase().default('usa'),
    style: z.enum(['photography', 'infographic', 'diagram']).default('photography'),
});
