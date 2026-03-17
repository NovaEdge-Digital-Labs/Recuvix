import { Router } from 'express';
import { exportSchema } from '../validators/exportSchemas';
import { generateExportContent } from '../services/exportService';
import { checkRateLimit } from '../utils/rateLimiter';

const router = Router();

router.post('/package', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        const validation = exportSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }

        const { outputFormat, seoMeta } = validation.data;
        const contentString = generateExportContent(validation.data);

        const filename = `${seoMeta.slug}.${outputFormat}`;
        let contentType = 'text/plain';

        if (outputFormat === 'html') contentType = 'text/html; charset=utf-8';
        if (outputFormat === 'md') contentType = 'text/markdown; charset=utf-8';
        if (outputFormat === 'xml') contentType = 'application/xml; charset=utf-8';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(contentString);
    } catch (error: any) {
        console.error('Export Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
