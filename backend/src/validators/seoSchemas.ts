import { z } from 'zod';

export const seoMetaSchema = z.object({
    blogTitle: z.string().min(1, 'Blog title is required'),
    blogContent: z.string().min(10, 'Blog content is required'),
    country: z.string().toLowerCase().default('usa'),
    writerName: z.string().min(1, 'Writer name is required'),
    websiteUrl: z.string().min(1, 'Website URL is required'),
    thumbnailUrl: z.string().url('Invalid thumbnail URL'),
    focusKeyword: z.string().min(1, 'Focus keyword is required'),
    secondaryKeywords: z.array(z.string()).max(5).default([]),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    companyName: z.string().optional().default(''),
});
