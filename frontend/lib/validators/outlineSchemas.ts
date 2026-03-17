import { z } from "zod";

export const outlineGenerateSchema = z.object({
    llmProvider: z.enum(["claude", "openai", "gemini", "grok"]),
    apiKey: z.string().min(1, "API key is required"),
    topic: z.string().min(3, "Topic must be at least 3 characters"),
    country: z.string().min(2, "Country is required"),
    tone: z.string().min(1, "Tone is required"),
    wordCount: z.number().int().min(300).max(5000),
    focusKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).optional().default([]),
    angle: z.string().optional(),
    existingH2s: z.array(z.string()).optional().default([]),
    regenerationNote: z.string().optional(),
});

export type OutlineGenerateRequest = z.infer<typeof outlineGenerateSchema>;
