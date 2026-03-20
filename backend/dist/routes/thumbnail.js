"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const thumbnailSchemas_1 = require("../validators/thumbnailSchemas");
const colorExtractService_1 = require("../services/colorExtractService");
const thumbnailService_1 = require("../services/thumbnailService");
const rateLimiter_1 = require("../utils/rateLimiter");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/generate', upload.fields([
    { name: 'logoImage', maxCount: 1 },
    { name: 'userImage', maxCount: 1 },
    { name: 'colorThemeImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!(0, rateLimiter_1.checkRateLimit)(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        let blogTitle = req.body.blogTitle;
        let writerName = req.body.writerName;
        let websiteUrl = req.body.websiteUrl;
        let companyName = req.body.companyName;
        let fallbackBgColor = req.body.fallbackBgColor || '#1a1a2e';
        let country = req.body.country || 'usa';
        const files = req.files;
        let logoBuffer = files?.logoImage?.[0]?.buffer;
        let userBuffer = files?.userImage?.[0]?.buffer;
        let colorThemeBuffer = files?.colorThemeImage?.[0]?.buffer;
        // Support JSON payloads with URLs
        if (!blogTitle && req.body.title)
            blogTitle = req.body.title;
        if (!writerName && req.body.authorName)
            writerName = req.body.authorName;
        const { fetchImageBuffer } = require('../utils/imageFetcher');
        if (!logoBuffer && req.body.logoUrl) {
            try {
                logoBuffer = await fetchImageBuffer(req.body.logoUrl);
            }
            catch (e) {
                console.warn('Failed to fetch logoUrl:', e);
            }
        }
        if (!userBuffer && (req.body.userPhotoUrl || req.body.userImageUrl)) {
            const url = req.body.userPhotoUrl || req.body.userImageUrl;
            try {
                userBuffer = await fetchImageBuffer(url);
            }
            catch (e) {
                console.warn('Failed to fetch userPhotoUrl:', e);
            }
        }
        if (!colorThemeBuffer && req.body.colorThemeUrl) {
            try {
                colorThemeBuffer = await fetchImageBuffer(req.body.colorThemeUrl);
            }
            catch (e) {
                console.warn('Failed to fetch colorThemeUrl:', e);
            }
        }
        const validation = thumbnailSchemas_1.thumbnailSchema.safeParse({
            blogTitle,
            writerName,
            websiteUrl: websiteUrl || 'https://recuvix.in', // Fallback if missing
            companyName: companyName || '',
            fallbackBgColor,
            country
        });
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }
        let colors;
        if (colorThemeBuffer) {
            colors = await (0, colorExtractService_1.extractColors)(colorThemeBuffer, fallbackBgColor);
        }
        else {
            colors = {
                primary: fallbackBgColor,
                dark: '#1a1a2e',
                accent: '#ffffff',
            };
        }
        const result = await (0, thumbnailService_1.generateThumbnail)({
            blogTitle: validation.data.blogTitle,
            writerName: validation.data.writerName,
            websiteUrl: validation.data.websiteUrl,
            companyName: validation.data.companyName,
            country: validation.data.country,
            colors,
            logoImageBuffer: logoBuffer,
            userImageBuffer: userBuffer,
            backgroundImageUrl: validation.data.backgroundImageUrl
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Thumbnail Generation Error:', error);
        if (error.message?.includes('Cloudinary')) {
            return res.status(502).json({ error: 'External service unavailable', service: 'cloudinary' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
