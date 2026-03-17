"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportPackageSchema = exports.SEOMetaSchema = exports.AIImageSchema = exports.StockImageSchema = void 0;
const zod_1 = require("zod");
exports.StockImageSchema = zod_1.z.object({
    topic: zod_1.z.string().min(1, "Topic is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    count: zod_1.z.number().int().min(1).max(6).default(3),
    preferSource: zod_1.z.enum(["unsplash", "pexels", "both"]).default("both"),
});
exports.AIImageSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1, "Prompt is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    style: zod_1.z.enum(["photography", "infographic", "diagram"]),
});
exports.SEOMetaSchema = zod_1.z.object({
    blogTitle: zod_1.z.string().min(1, "Blog title is required"),
    blogContent: zod_1.z.string().min(1, "Blog content is required"),
    country: zod_1.z.string().min(1, "Country is required"),
    writerName: zod_1.z.string().min(1, "Writer name is required"),
    websiteUrl: zod_1.z.string().url("Must be a valid URL"),
    thumbnailUrl: zod_1.z.string().url("Must be a valid URL"),
    focusKeyword: zod_1.z.string().min(1, "Focus keyword is required"),
    secondaryKeywords: zod_1.z.array(zod_1.z.string()).max(5),
});
exports.ExportPackageSchema = zod_1.z.object({
    blogHtml: zod_1.z.string().min(1, "Blog HTML is required"),
    blogMarkdown: zod_1.z.string().min(1, "Blog Markdown is required"),
    seoMeta: zod_1.z.any(), // Client passes the exact response from /api/seo/meta
    thumbnailUrl: zod_1.z.string().url("Must be a valid URL"),
    outputFormat: zod_1.z.enum(["html", "md", "xml"]),
    blogTitle: zod_1.z.string().min(1, "Blog title is required"),
    writerName: zod_1.z.string().min(1, "Writer name is required"),
});
