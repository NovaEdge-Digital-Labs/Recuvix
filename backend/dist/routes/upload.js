"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uploadSchemas_1 = require("../validators/uploadSchemas");
const fileValidator_1 = require("../utils/fileValidator");
const uploadService_1 = require("../services/uploadService");
const rateLimiter_1 = require("../utils/rateLimiter");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/assets', upload.single('file'), async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!(0, rateLimiter_1.checkRateLimit)(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        const file = req.file;
        const typeStr = req.body.type;
        if (!file) {
            return res.status(400).json({ error: 'Validation failed', details: 'File is required' });
        }
        const typeValid = uploadSchemas_1.uploadAssetSchema.safeParse({ type: typeStr });
        if (!typeValid.success) {
            return res.status(400).json({ error: 'Validation failed', details: typeValid.error.format() });
        }
        const type = typeValid.data.type;
        if (!(0, fileValidator_1.validateImageFile)({ mimetype: file.mimetype, size: file.size }).isValid) {
            return res.status(400).json({ error: 'Validation failed', details: 'Invalid file' });
        }
        const uploadResult = await (0, uploadService_1.processAndUploadImage)(file.buffer, type);
        const responseData = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error('Upload Error:', error);
        if (error.message?.includes('Cloudinary')) {
            return res.status(502).json({ error: 'External service unavailable', service: 'cloudinary' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
