import { Router } from 'express';
import multer from 'multer';
import { uploadAssetSchema } from '../validators/uploadSchemas';
import { validateImageFile } from '../utils/fileValidator';
import { processAndUploadImage } from '../services/uploadService';
import { checkRateLimit } from '../utils/rateLimiter';
import { UploadResponse } from '../types';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/assets', upload.single('file'), async (req, res) => {
    try {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ error: 'Too many requests' });
        }

        const file = req.file;
        const typeStr = req.body.type;

        if (!file) {
            return res.status(400).json({ error: 'Validation failed', details: 'File is required' });
        }

        const typeValid = uploadAssetSchema.safeParse({ type: typeStr });
        if (!typeValid.success) {
            return res.status(400).json({ error: 'Validation failed', details: typeValid.error.format() });
        }
        const type = typeValid.data.type;

        if (!validateImageFile({ mimetype: file.mimetype, size: file.size }).isValid) {
            return res.status(400).json({ error: 'Validation failed', details: 'Invalid file' });
        }

        const uploadResult = await processAndUploadImage(file.buffer, type);

        const responseData: UploadResponse = {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
        };

        res.status(200).json(responseData);
    } catch (error: any) {
        console.error('Upload Error:', error);
        if (error.message?.includes('Cloudinary')) {
            return res.status(502).json({ error: 'External service unavailable', service: 'cloudinary' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
