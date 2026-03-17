import { Router } from 'express';
import { stockImageSchema, generatedImageSchema } from '../validators/imageSchemas';
import { fetchStockImages } from '../services/stockImageService';
import { generateAiImage } from '../services/aiImageService';
import { checkRateLimit } from '../utils/rateLimiter';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

router.post('/stock', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        const validation = stockImageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }

        const { topic, country, count, preferSource } = validation.data;
        const result = await fetchStockImages(topic, country, count, preferSource);

        res.status(200).json(result);
    } catch (error: any) {
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
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        const validation = generatedImageSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }

        const { prompt, country, style } = validation.data;
        const aiResult = await generateAiImage(prompt, country, style);

        const uploadResult = await cloudinary.uploader.upload(aiResult.imageUrl, {
            folder: 'bloggen/ai_images',
        });

        res.status(200).json({ imageUrl: uploadResult.secure_url });
    } catch (error: any) {
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

export default router;
