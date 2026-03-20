"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoMetaSchema = void 0;
const zod_1 = require("zod");
exports.seoMetaSchema = zod_1.z.object({
    blogTitle: zod_1.z.string().min(1, 'Blog title is required'),
    blogContent: zod_1.z.string().min(10, 'Blog content is required'),
    country: zod_1.z.string().toLowerCase().default('usa'),
    writerName: zod_1.z.string().min(1, 'Writer name is required'),
    websiteUrl: zod_1.z.string().min(1, 'Website URL is required'),
    thumbnailUrl: zod_1.z.string().url('Invalid thumbnail URL'),
    focusKeyword: zod_1.z.string().min(1, 'Focus keyword is required'),
    secondaryKeywords: zod_1.z.array(zod_1.z.string()).max(5).default([]),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    companyName: zod_1.z.string().optional().default(''),
});
