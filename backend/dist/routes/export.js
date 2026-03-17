"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const exportSchemas_1 = require("../validators/exportSchemas");
const exportService_1 = require("../services/exportService");
const rateLimiter_1 = require("../utils/rateLimiter");
const router = (0, express_1.Router)();
router.post('/package', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!(0, rateLimiter_1.checkRateLimit)(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        const validation = exportSchemas_1.exportSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }
        const { outputFormat, seoMeta } = validation.data;
        const contentString = (0, exportService_1.generateExportContent)(validation.data);
        const filename = `${seoMeta.slug}.${outputFormat}`;
        let contentType = 'text/plain';
        if (outputFormat === 'html')
            contentType = 'text/html; charset=utf-8';
        if (outputFormat === 'md')
            contentType = 'text/markdown; charset=utf-8';
        if (outputFormat === 'xml')
            contentType = 'application/xml; charset=utf-8';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(contentString);
    }
    catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
