import { z } from "zod";

export const WPTestConnectionSchema = z.object({
    siteUrl: z.string().url("Must be a valid URL"),
    username: z.string().min(1, "Username is required"),
    appPassword: z.string().min(1, "Application Password is required"),
});

export const WPUploadImageSchema = z.object({
    siteUrl: z.string().url(),
    username: z.string(),
    appPassword: z.string(),
    imageUrl: z.string().url(),
    fileName: z.string(),
    altText: z.string().default(""),
    caption: z.string().optional(),
});

export const WPPublishSchema = z.object({
    siteUrl: z.string().url(),
    username: z.string(),
    appPassword: z.string(),

    // Post content
    title: z.string().min(1),
    content: z.string().min(1),
    excerpt: z.string().max(300).optional(),
    slug: z.string().optional(),
    status: z.enum(["draft", "publish", "pending"]).default("draft"),

    // SEO meta
    focusKeyword: z.string().default(""),
    metaTitle: z.string().default(""),
    metaDescription: z.string().default(""),

    // Taxonomy
    categoryIds: z.array(z.number()).default([]),
    tags: z.array(z.string()).default([]),

    // Media
    featuredImageId: z.number().nullable().default(null),

    // Author
    authorId: z.number().nullable().default(null),

    // Options
    injectYoastMeta: z.boolean().default(true),
    injectRankMathMeta: z.boolean().default(false),

    // Blog metadata (for history)
    blogTitle: z.string(),
    generatedAt: z.string(),
});

export const WPFetchMetadataSchema = z.object({
    siteUrl: z.string().url(),
    username: z.string(),
    appPassword: z.string(),
});
