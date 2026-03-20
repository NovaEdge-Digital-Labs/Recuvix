export type StockImageResult = {
    url: string;
    alt: string;
    photographer: string;
    source: 'unsplash' | 'pexels';
    width: number;
    height: number;
};

export type StockImageResponse = {
    images: StockImageResult[];
    total: number;
};

export type GeneratedImageResponse = {
    imageUrl: string;
    prompt: string;
};

export type ThumbnailColors = {
    primary: string;
    dark: string;
    accent: string;
};

export type ThumbnailResponse = {
    thumbnailUrl: string;
    colors: ThumbnailColors;
};

export type SeoMetaResponse = {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    openGraph: Record<string, string>;
    twitterCard: Record<string, string>;
    jsonLd: Record<string, unknown>;
    hreflang?: string;
    htmlMetaTags: string;
};

export type UploadResponse = {
    url: string;
    publicId: string;
    width: number;
    height: number;
};

export type AIModel = "claude" | "openai" | "gemini" | "grok" | "openrouter";
