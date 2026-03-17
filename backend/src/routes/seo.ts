import { Router } from 'express';
import { seoMetaSchema } from '../validators/seoSchemas';
import { generateSeoMeta } from '../services/seoService';
import { checkRateLimit } from '../utils/rateLimiter';

const router = Router();

router.post('/meta', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        const validation = seoMetaSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }

        const seoMeta = generateSeoMeta(validation.data);
        res.status(200).json(seoMeta);
    } catch (error: any) {
        console.error('SEO Meta Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
