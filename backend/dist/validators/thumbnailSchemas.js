"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thumbnailSchema = void 0;
const zod_1 = require("zod");
// For multipart/form-data we often validate the parsed fields.
exports.thumbnailSchema = zod_1.z.object({
    blogTitle: zod_1.z.string().min(1, 'Blog title is required').max(120),
    writerName: zod_1.z.string().min(1, 'Writer name is required').max(50),
    websiteUrl: zod_1.z.string().min(1, 'Website URL is required').max(100),
    fallbackBgColor: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional().default('#1a1a2e'),
    country: zod_1.z.string().toLowerCase().default('usa'),
});
