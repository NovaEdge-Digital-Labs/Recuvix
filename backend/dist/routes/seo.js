"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seoSchemas_1 = require("../validators/seoSchemas");
const seoService_1 = require("../services/seoService");
const rateLimiter_1 = require("../utils/rateLimiter");
const router = (0, express_1.Router)();
router.post('/meta', async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!(0, rateLimiter_1.checkRateLimit)(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        const validation = seoSchemas_1.seoMetaSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }
        const seoMeta = (0, seoService_1.generateSeoMeta)(validation.data);
        res.status(200).json(seoMeta);
    }
    catch (error) {
        console.error('SEO Meta Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
