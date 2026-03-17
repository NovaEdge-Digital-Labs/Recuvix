import { z } from 'zod';

// For multipart/form-data we often validate the parsed fields.
export const thumbnailSchema = z.object({
    blogTitle: z.string().min(1, 'Blog title is required').max(120),
    writerName: z.string().min(1, 'Writer name is required').max(50),
    websiteUrl: z.string().min(1, 'Website URL is required').max(100),
    fallbackBgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().default('#1a1a2e'),
    country: z.string().toLowerCase().default('usa'),
});
