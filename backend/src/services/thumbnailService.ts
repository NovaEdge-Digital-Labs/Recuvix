import { createCanvas, loadImage, registerFont } from 'canvas';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { ThumbnailColors, ThumbnailResponse } from '../types';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Depending on deployment, fonts need to be loaded from local files
import path from 'path';
let fontsLoaded = false;
try {
    // Fonts are in ../../public/fonts relative to this file in src/services
    const fontsDir = path.join(__dirname, '../../public/fonts');
    registerFont(path.join(fontsDir, 'Inter-Bold.ttf'), { family: 'Inter', weight: 'bold' });
    registerFont(path.join(fontsDir, 'Inter-Regular.ttf'), { family: 'Inter', weight: 'normal' });
    fontsLoaded = true;
} catch (e) {
    console.warn('Failed to load local fonts for thumbnails; falling back to system fonts:', e);
}

export async function generateThumbnail(data: {
    blogTitle: string;
    writerName: string;
    websiteUrl: string;
    country?: string;
    companyName?: string;
    colors: ThumbnailColors;
    userImageBuffer?: Buffer;
    logoImageBuffer?: Buffer;
    backgroundImageUrl?: string;
}): Promise<ThumbnailResponse> {
    const width = 1280;
    const height = 720;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. BACKGROUND LAYER
    if (data.backgroundImageUrl) {
        try {
            const bgImg = await loadImage(data.backgroundImageUrl);
            ctx.drawImage(bgImg, 0, 0, width, height);
        } catch (e) {
            console.error('Failed to load background image:', e);
            ctx.fillStyle = '#0d0014';
            ctx.fillRect(0, 0, width, height);
        }
    } else {
        ctx.fillStyle = '#0d0014'; // Base dark purple-black
        ctx.fillRect(0, 0, width, height);
    }

    // Overlay nebula/stars even on AI images for consistent cinematic feel
    // Large center-left nebula
    const nebulaGlow = ctx.createRadialGradient(width * 0.3, height * 0.4, 0, width * 0.3, height * 0.4, 600);
    nebulaGlow.addColorStop(0, '#7c3aed33'); // Slightly stronger overlay
    nebulaGlow.addColorStop(1, '#00000000');
    ctx.fillStyle = nebulaGlow;
    ctx.fillRect(0, 0, width, height);

    // Scattered star particles
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 1.5;
        const opacity = Math.random() * 0.6 + 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Subtle galaxy arm swirl (upper-right)
    ctx.save();
    ctx.translate(width * 0.8, height * 0.2);
    ctx.rotate(-Math.PI / 4);
    const swirl = ctx.createRadialGradient(0, 0, 0, 0, 0, 300);
    swirl.addColorStop(0, 'rgba(124, 58, 237, 0.05)');
    swirl.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = swirl;
    ctx.scale(2, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. COUNTRY MAP LAYER (Optional)
    const isIndia = (data.country?.toLowerCase() === 'india');
    if (isIndia) {
        // Simple approximation of India's footprint as a tech-style pattern
        ctx.save();
        ctx.translate(width * 0.75, height * 0.4);
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
        ctx.lineWidth = 2;
        // Simplified geometric India shape
        ctx.beginPath();
        ctx.moveTo(0, -100); ctx.lineTo(40, -60); ctx.lineTo(60, 0);
        ctx.lineTo(20, 80); ctx.lineTo(0, 120); ctx.lineTo(-20, 80);
        ctx.lineTo(-60, 0); ctx.lineTo(-40, -60); ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    // 3. PERSON/SUBJECT LAYER
    if (data.userImageBuffer) {
        const personWidth = width * 0.45;
        const personHeight = height;

        const img = await loadImage(await sharp(data.userImageBuffer)
            .resize({ height: height, width: Math.round(personWidth), fit: 'cover' })
            .png()
            .toBuffer());

        ctx.save();
        // Create subtle rim light glow
        const rimGlow = ctx.createRadialGradient(personWidth * 0.4, height * 0.4, 0, personWidth * 0.4, height * 0.4, 400);
        rimGlow.addColorStop(0, 'rgba(124, 58, 237, 0.25)');
        rimGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rimGlow;
        ctx.fillRect(0, 0, personWidth + 100, height);

        // Mask for bottom blending
        const personCanvas = createCanvas(personWidth, height);
        const pCtx = personCanvas.getContext('2d');
        pCtx.drawImage(img, 0, 0, personWidth, height);

        // Gradient Mask (Blend Bottom)
        pCtx.globalCompositeOperation = 'destination-in';
        const mask = pCtx.createLinearGradient(0, height * 0.5, 0, height);
        mask.addColorStop(0, 'rgba(0,0,0,1)');
        mask.addColorStop(0.9, 'rgba(0,0,0,0)');
        pCtx.fillStyle = mask;
        pCtx.fillRect(0, 0, personWidth, height);

        ctx.drawImage(personCanvas, 0, 0);
        ctx.restore();
    }

    // 4. FLOATING ICONS LAYER
    const thematicIcons = ['⚡', '💎', '🚀', '🌐', '📈'];
    for (let i = 0; i < 6; i++) {
        const x = 50 + Math.random() * (width - 100);
        const y = 50 + Math.random() * (height - 100);
        // Avoid primary face/text areas
        if (x < width * 0.45 && y > height * 0.2) continue;
        if (x > width * 0.5 && y < height * 0.6) continue;

        ctx.font = '36px Arial';
        ctx.fillStyle = 'rgba(124, 58, 237, 0.3)';
        ctx.fillText(thematicIcons[i % thematicIcons.length], x, y);
    }

    // 5. TYPOGRAPHY (Right Side Alignment)
    const textLeft = width * 0.52;
    const padding = 60;
    const titleFont = fontsLoaded ? 'Inter' : 'Arial, sans-serif';

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Cleanup title
    const cleanTitle = data.blogTitle.replace(/^"|"$/g, '').trim().toUpperCase();
    const words = cleanTitle.split(' ');

    // Dynamic scaling for long titles
    let baseSize = 82;
    if (cleanTitle.length > 30) baseSize = 72;
    if (cleanTitle.length > 50) baseSize = 62;

    ctx.font = `bold ${baseSize}px ${titleFont}`;
    ctx.fillStyle = '#FFFFFF';

    const maxTextWidth = width - textLeft - padding;
    let lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (ctx.measureText(testLine).width < maxTextWidth) {
            currentLine = testLine;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    // Safety cap for layout
    lines = lines.slice(0, 3);

    let currentY = 160;
    lines.forEach((line, idx) => {
        // Apply Gold Gradient to the first line or important hook words
        if (idx === 1 || (lines.length === 1 && idx === 0)) {
            const grad = ctx.createLinearGradient(textLeft, currentY, textLeft + ctx.measureText(line).width, currentY);
            grad.addColorStop(0, '#FFD700');
            grad.addColorStop(0.5, '#FFF8DC');
            grad.addColorStop(1, '#FFA500');
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = '#FFFFFF';
        }

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';
        ctx.fillText(line, textLeft, currentY);
        currentY += baseSize * 1.15;
    });

    // SUBTITLE
    ctx.shadowBlur = 0;
    ctx.font = `semi-bold 32px ${titleFont}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('CRITICAL INSIGHTS FOR 2024', textLeft, currentY + 10);

    // 6. LOGO & BRANDING
    if (data.logoImageBuffer) {
        const logoImg = await loadImage(await sharp(data.logoImageBuffer).resize({ height: 45 }).png().toBuffer());
        ctx.fillStyle = 'rgba(124, 58, 237, 0.2)';
        ctx.beginPath();
        const logoX = width - logoImg.width - 60;
        ctx.roundRect(logoX - 15, 35, logoImg.width + 30, 65, 30);
        ctx.fill();
        ctx.drawImage(logoImg, logoX, 45);
    }

    // Brand Name (Bottom Right)
    ctx.font = `bold 22px ${titleFont}`;
    ctx.textAlign = 'right';
    const brandName = (data.companyName || data.websiteUrl.split('//')[1] || 'recuvix.in').toUpperCase();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(brandName, width - 60, height - 60);

    // Subtle edge border (top branding)
    ctx.strokeStyle = '#7c3aed33';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(textLeft, 130);
    ctx.lineTo(width - 60, 130);
    ctx.stroke();

    // 7. VIGNETTE & FINISH
    const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.4, width / 2, height / 2, width * 0.8);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    const outBuffer = canvas.toBuffer('image/png');

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'bloggen/thumbnails', format: 'webp' },
            (error, result) => {
                if (error || !result) reject(error || new Error('Upload failed'));
                else resolve({ thumbnailUrl: result.secure_url, colors: data.colors });
            }
        );
        uploadStream.end(outBuffer);
    });
}
