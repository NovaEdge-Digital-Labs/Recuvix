"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = generateThumbnail;
const canvas_1 = require("canvas");
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
// Depending on deployment, fonts need to be loaded from local files
const path_1 = __importDefault(require("path"));
(0, canvas_1.registerFont)(path_1.default.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'), { family: 'Inter', weight: 'bold' });
(0, canvas_1.registerFont)(path_1.default.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), { family: 'Inter', weight: 'normal' });
async function generateThumbnail(data) {
    const width = 1200;
    const height = 630;
    // STEP 1: Canvas setup
    const canvas = (0, canvas_1.createCanvas)(width, height);
    const ctx = canvas.getContext('2d');
    // STEP 3: Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, data.colors.primary);
    gradient.addColorStop(1, data.colors.dark);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    // STEP 4: Geometric decoration
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = data.colors.accent;
    // Circle 1
    ctx.beginPath();
    ctx.arc(150, 100, 200, 0, Math.PI * 2);
    ctx.fill();
    // Circle 2
    ctx.beginPath();
    ctx.arc(width - 100, height - 50, 300, 0, Math.PI * 2);
    ctx.fill();
    // Rectangle
    ctx.fillRect(width / 2 - 100, height / 2 - 100, 200, 200);
    ctx.globalAlpha = 1.0; // Reset alpha
    // STEP 5: User image
    let userImageX = 60;
    let userImageY = 390;
    let userImageSize = 180;
    if (data.userImageBuffer) {
        // Resize with sharp to be safe before passing to canvas
        const processedUserImage = await (0, sharp_1.default)(data.userImageBuffer)
            .resize(userImageSize, userImageSize, { fit: 'cover' })
            .png()
            .toBuffer();
        const img = await (0, canvas_1.loadImage)(processedUserImage);
        ctx.save();
        ctx.beginPath();
        ctx.arc(userImageX + userImageSize / 2, userImageY + userImageSize / 2, Math.max(userImageSize / 2 - 4, 0), 0, Math.PI * 2, true);
        ctx.closePath();
        // Border ring (Draw first so it goes "around") Needs to be before clip but drawing outer first
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(img, userImageX, userImageY, userImageSize, userImageSize);
        ctx.restore();
    }
    else {
        // If no user image, adjust left margin for text
        userImageSize = 0;
    }
    // STEP 6: Logo
    if (data.logoImageBuffer) {
        const maxLogoWidth = 140;
        const maxLogoHeight = 70;
        const processedLogo = await (0, sharp_1.default)(data.logoImageBuffer)
            .resize({ width: maxLogoWidth, height: maxLogoHeight, fit: 'inside' })
            .png()
            .toBuffer();
        const logoImg = await (0, canvas_1.loadImage)(processedLogo);
        // Slight shadow behind logo
        ctx.save();
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 10;
        const logoX = width - logoImg.width - 40;
        const logoY = 30;
        ctx.drawImage(logoImg, logoX, logoY);
        ctx.restore();
    }
    // STEP 7: Blog title text
    ctx.font = 'bold 52px Inter, sans-serif'; // Fallback to sans-serif if custom fonts fail
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.textBaseline = 'middle';
    const titleX = 60;
    const maxTitleWidth = width - 120;
    const titleY = height / 2 - 40;
    // Max 2 lines wrapping logic
    const words = data.blogTitle.split(' ');
    let line1 = '';
    let line2 = '';
    let i = 0;
    while (i < words.length && ctx.measureText(line1 + words[i] + ' ').width < maxTitleWidth) {
        line1 += words[i] + ' ';
        i++;
    }
    while (i < words.length && ctx.measureText(line2 + words[i] + ' ').width < maxTitleWidth - 40) { // Keep space for ellipsis
        line2 += words[i] + ' ';
        i++;
    }
    if (i < words.length) {
        line2 += '...';
    }
    ctx.fillText(line1.trim(), titleX, titleY - 30);
    if (line2) {
        ctx.fillText(line2.trim(), titleX, titleY + 30);
    }
    // Reset shadow for subsequent text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    // STEP 8: Writer name
    ctx.font = '28px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    const textLeftOffset = data.userImageBuffer ? userImageX + userImageSize + 20 : 60;
    const writerNameY = data.userImageBuffer ? userImageY + userImageSize / 2 + 10 : titleY + 100;
    ctx.fillText(data.writerName, textLeftOffset, writerNameY);
    // STEP 9: Website URL
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'right';
    ctx.fillText(data.websiteUrl, width - 40, height - 40);
    // STEP 10: Export
    const outBuffer = canvas.toBuffer('image/png');
    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'bloggen/thumbnails',
            format: 'webp',
        }, (error, result) => {
            if (error || !result) {
                reject(error || new Error('Failed to upload thumbnail to Cloudinary'));
            }
            else {
                resolve({
                    thumbnailUrl: result.secure_url,
                    colors: data.colors
                });
            }
        });
        uploadStream.end(outBuffer);
    });
}
