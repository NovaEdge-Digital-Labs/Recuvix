"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSchema = void 0;
const zod_1 = require("zod");
exports.exportSchema = zod_1.z.object({
    blogHtml: zod_1.z.string().min(1, 'Blog HTML is required'),
    blogMarkdown: zod_1.z.string().min(1, 'Blog Markdown is required'),
    seoMeta: zod_1.z.object({
        slug: zod_1.z.string(),
        metaTitle: zod_1.z.string(),
        metaDescription: zod_1.z.string(),
        focusKeyword: zod_1.z.string(),
        secondaryKeywords: zod_1.z.array(zod_1.z.string()),
        openGraph: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
        twitterCard: zod_1.z.record(zod_1.z.string(), zod_1.z.string()),
        jsonLd: zod_1.z.record(zod_1.z.string(), zod_1.z.any()),
        hreflang: zod_1.z.string().optional(),
        htmlMetaTags: zod_1.z.string(),
    }),
    thumbnailUrl: zod_1.z.string().url(),
    outputFormat: zod_1.z.enum(['html', 'md', 'xml']),
    blogTitle: zod_1.z.string().min(1),
    writerName: zod_1.z.string().min(1),
});
