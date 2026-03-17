// Types for the Blog Outline Preview feature

export interface H2Item {
    id: string;
    text: string;
    locked: boolean; // user has manually edited this H2
}

export interface OutlineResponse {
    h1: string;
    focusKeyword: string;
    h2s: H2Item[];
    estimatedReadTime: number;
    contentStrategy: string;
}

export interface ApprovedOutline {
    h1: string;
    h2s: string[];
    focusKeyword: string;
}

export interface StoredApprovedOutline {
    h1: string;
    h2s: H2Item[];
    focusKeyword: string;
    generatedAt: string;
    generationInput: object;
}

export interface OutlineGenerationInput {
    llmProvider: "claude" | "openai" | "gemini" | "grok";
    apiKey: string;
    topic: string;
    country: string;
    tone: string;
    wordCount: number;
    focusKeyword?: string;
    secondaryKeywords?: string[];
    angle?: string;
    existingH2s?: string[];
    regenerationNote?: string;
}
