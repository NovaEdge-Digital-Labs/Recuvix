import { z } from "zod";

export const TitleSuggestionSchema = z.object({
    title: z.string().min(45).max(75), // Slightly wider range for validation maturity
    focusKeyword: z.string(),
    angle: z.string(),
    estimatedSearchIntent: z.enum(["Informational", "Commercial", "Transactional"]),
    whyItWorks: z.string(),
});

export type TitleSuggestion = z.infer<typeof TitleSuggestionSchema> & {
    id: string;
};

export const TitleSuggestRequestSchema = z.object({
    llmProvider: z.string().optional().nullable(),
    apiKey: z.string().optional().nullable(),
    topic: z.string().min(3).max(200),
    country: z.string(),
    count: z.number().min(1).max(8).default(5),
    existingTitle: z.string().optional(),
    avoidAngles: z.array(z.string()).optional(),
});

export type TitleSuggestRequest = z.infer<typeof TitleSuggestRequestSchema>;

export interface TitleSuggestResponse {
    suggestions: TitleSuggestion[];
    topic: string;
    country: string;
    model: string;
}
