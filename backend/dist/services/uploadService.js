"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAndUploadImage = processAndUploadImage;
const cloudinary_1 = require("cloudinary");
const sharp_1 = __importDefault(require("sharp"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function processAndUploadImage(buffer, type) {
    let processedBuffer;
    // Process image with Sharp based on type requirements
    if (type === 'logo') {
        processedBuffer = await (0, sharp_1.default)(buffer)
            .resize({ width: 400, height: 200, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
    }
    else if (type === 'userImage') {
        processedBuffer = await (0, sharp_1.default)(buffer)
            .resize({ width: 500, height: 500, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
    }
    else if (type === 'colorTheme') {
        processedBuffer = await (0, sharp_1.default)(buffer)
            .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
    }
    else {
        throw new Error('Invalid image type');
    }
    // Upload to Cloudinary using a stream
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `bloggen/${type}`,
            format: 'webp',
        }, (error, result) => {
            if (error || !result) {
                reject(error || new Error('Failed to upload to Cloudinary'));
            }
            else {
                resolve(result);
            }
        });
        uploadStream.end(processedBuffer);
    });
}
