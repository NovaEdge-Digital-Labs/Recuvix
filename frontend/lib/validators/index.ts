import { z } from "zod";

export const StockImageSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    country: z.string().min(1, "Country is required"),
    count: z.number().int().min(1).max(6).default(3),
    preferSource: z.enum(["unsplash", "pexels", "both"]).default("both"),
});

export const AIImageSchema = z.object({
    prompt: z.string().min(1, "Prompt is required"),
    country: z.string().min(1, "Country is required"),
    style: z.enum(["photography", "infographic", "diagram"]),
});

export const SEOMetaSchema = z.object({
    blogTitle: z.string().min(1, "Blog title is required"),
    blogContent: z.string().min(1, "Blog content is required"),
    country: z.string().min(1, "Country is required"),
    writerName: z.string().min(1, "Writer name is required"),
    websiteUrl: z.string().url("Must be a valid URL"),
    thumbnailUrl: z.string().url("Must be a valid URL"),
    focusKeyword: z.string().min(1, "Focus keyword is required"),
    secondaryKeywords: z.array(z.string()).max(5),
});

export const ExportPackageSchema = z.object({
    blogHtml: z.string().min(1, "Blog HTML is required"),
    blogMarkdown: z.string().min(1, "Blog Markdown is required"),
    seoMeta: z.any(), // Client passes the exact response from /api/seo/meta
    thumbnailUrl: z.string().url("Must be a valid URL"),
    outputFormat: z.enum(["html", "md", "xml"]),
    blogTitle: z.string().min(1, "Blog title is required"),
    writerName: z.string().min(1, "Writer name is required"),
});
