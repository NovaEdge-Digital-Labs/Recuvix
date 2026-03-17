import { z } from "zod";

export const llmProviderSchema = z.enum(["claude", "openai", "gemini", "grok"]);

export const regenerateBlogSchema = z.object({
    llmProvider: llmProviderSchema,
    apiKey: z.string().min(1, "API Key is required"),
    originalTopic: z.string(),
    originalHtml: z.string(),
    instruction: z.string().min(1, "Instruction is required"),
    country: z.string(),
    tone: z.string(),
    wordCount: z.number().optional(),
    focusKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).optional(),
    approvedOutline: z.object({
        h1: z.string(),
        h2s: z.array(z.string()),
    }).optional(),
    keepStructure: z.boolean().default(true),
});

export const regenerateSectionSchema = z.object({
    llmProvider: llmProviderSchema,
    apiKey: z.string().min(1, "API Key is required"),
    blogTopic: z.string(),
    fullBlogContext: z.string(),
    sectionH2: z.string(),
    currentSectionHtml: z.string(),
    instruction: z.string().optional(),
    country: z.string(),
    tone: z.string(),
    focusKeyword: z.string(),
    sectionPosition: z.number(),
    totalSections: z.number(),
    action: z.enum(["rewrite", "expand", "simplify", "tone_change"]),
});

export const improveSectionSchema = z.object({
    llmProvider: llmProviderSchema,
    apiKey: z.string().min(1, "API Key is required"),
    sectionH2: z.string(),
    currentSectionHtml: z.string(),
    action: z.enum([
        "fix_grammar",
        "add_examples",
        "add_statistics",
        "make_scannable",
        "improve_seo",
        "add_cta"
    ]),
    country: z.string(),
    focusKeyword: z.string(),
});

export type RegenerateBlogInput = z.infer<typeof regenerateBlogSchema>;
export type RegenerateSectionInput = z.infer<typeof regenerateSectionSchema>;
export type ImproveSectionInput = z.infer<typeof improveSectionSchema>;
