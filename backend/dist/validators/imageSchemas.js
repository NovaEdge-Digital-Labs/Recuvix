"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatedImageSchema = exports.stockImageSchema = void 0;
const zod_1 = require("zod");
exports.stockImageSchema = zod_1.z.object({
    topic: zod_1.z.string().min(1, 'Topic is required').max(150),
    country: zod_1.z.string().toLowerCase().default('usa'),
    count: zod_1.z.number().int().min(1).max(6).default(3),
    preferSource: zod_1.z.enum(['unsplash', 'pexels', 'both']).default('both'),
});
exports.generatedImageSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(3, 'Prompt is required').max(500),
    country: zod_1.z.string().toLowerCase().default('usa'),
    style: zod_1.z.enum(['photography', 'infographic', 'diagram']).default('photography'),
});
