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
const fileValidator_1 = require("../utils/fileValidator");
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
        const blogTitle = req.body.blogTitle;
        const writerName = req.body.writerName;
        const websiteUrl = req.body.websiteUrl;
        const fallbackBgColor = req.body.fallbackBgColor || '#1a1a2e';
        const country = req.body.country || 'usa';
        const files = req.files;
        const logoImage = files?.logoImage?.[0];
        const userImage = files?.userImage?.[0];
        const colorThemeImage = files?.colorThemeImage?.[0];
        const validation = thumbnailSchemas_1.thumbnailSchema.safeParse({
            blogTitle,
            writerName,
            websiteUrl,
            fallbackBgColor,
            country
        });
        if (!validation.success) {
            return res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
        }
        if (logoImage && !(0, fileValidator_1.validateImageFile)({ mimetype: logoImage.mimetype, size: logoImage.size }).isValid) {
            return res.status(400).json({ error: 'Invalid logo image' });
        }
        if (userImage && !(0, fileValidator_1.validateImageFile)({ mimetype: userImage.mimetype, size: userImage.size }).isValid) {
            return res.status(400).json({ error: 'Invalid user image' });
        }
        if (colorThemeImage && !(0, fileValidator_1.validateImageFile)({ mimetype: colorThemeImage.mimetype, size: colorThemeImage.size }).isValid) {
            return res.status(400).json({ error: 'Invalid color theme image' });
        }
        const logoBuffer = logoImage?.buffer;
        const userBuffer = userImage?.buffer;
        const colorThemeBuffer = colorThemeImage?.buffer;
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
            colors,
            logoImageBuffer: logoBuffer,
            userImageBuffer: userBuffer
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
