"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageSchemas_1 = require("../validators/imageSchemas");
const stockImageService_1 = require("../services/stockImageService");
const aiImageService_1 = require("../services/aiImageService");
const rateLimiter_1 = require("../utils/rateLimiter");
const cloudinary_1 = require("cloudinary");
const router = (0, express_1.Router)();
router.post('/stock', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!(0, rateLimiter_1.checkRateLimit)(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        const validation = imageSchemas_1.stockImageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }
        const { topic, country, count, preferSource } = validation.data;
        const result = await (0, stockImageService_1.fetchStockImages)(topic, country, count, preferSource);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Stock Images Error:', error);
        if (error.message?.includes('Unsplash API') || error.message?.includes('Pexels API')) {
            return res.status(502).json({ error: 'External service unavailable', service: 'stock_image' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/generate', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!(0, rateLimiter_1.checkRateLimit)(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        const validation = imageSchemas_1.generatedImageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }
        const { prompt, country, style } = validation.data;
        const aiResult = await (0, aiImageService_1.generateAiImage)(prompt, country, style);
        const uploadResult = await cloudinary_1.v2.uploader.upload(aiResult.imageUrl, {
            folder: 'bloggen/ai_images',
        });
        res.status(200).json({ imageUrl: uploadResult.secure_url });
    }
    catch (error) {
        console.error('AI Generate Error:', error);
        if (error.message?.includes('Replicate')) {
            return res.status(502).json({ error: 'External service unavailable', service: 'replicate' });
        }
        if (error.message?.includes('Cloudinary')) {
            return res.status(502).json({ error: 'External service unavailable', service: 'cloudinary' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
