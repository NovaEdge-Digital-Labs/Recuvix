import { z } from 'zod';

export const exportSchema = z.object({
    blogHtml: z.string().min(1, 'Blog HTML is required'),
    blogMarkdown: z.string().min(1, 'Blog Markdown is required'),
    seoMeta: z.object({
        slug: z.string(),
        metaTitle: z.string(),
        metaDescription: z.string(),
        focusKeyword: z.string(),
        secondaryKeywords: z.array(z.string()),
        openGraph: z.record(z.string(), z.string()),
        twitterCard: z.record(z.string(), z.string()),
        jsonLd: z.record(z.string(), z.any()),
        hreflang: z.string().optional(),
        htmlMetaTags: z.string(),
    }),
    thumbnailUrl: z.string().url(),
    outputFormat: z.enum(['html', 'md', 'xml']),
    blogTitle: z.string().min(1),
    writerName: z.string().min(1),
});
