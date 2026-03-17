import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function processAndUploadImage(
    buffer: Buffer,
    type: 'logo' | 'userImage' | 'colorTheme'
): Promise<UploadApiResponse> {
    let processedBuffer: Buffer;

    // Process image with Sharp based on type requirements
    if (type === 'logo') {
        processedBuffer = await sharp(buffer)
            .resize({ width: 400, height: 200, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
    } else if (type === 'userImage') {
        processedBuffer = await sharp(buffer)
            .resize({ width: 500, height: 500, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
    } else if (type === 'colorTheme') {
        processedBuffer = await sharp(buffer)
            .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
    } else {
        throw new Error('Invalid image type');
    }

    // Upload to Cloudinary using a stream
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `bloggen/${type}`,
                format: 'webp',
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error('Failed to upload to Cloudinary'));
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(processedBuffer);
    });
}
