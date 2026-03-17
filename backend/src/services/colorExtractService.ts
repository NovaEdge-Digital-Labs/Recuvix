const Vibrant = require('node-vibrant/node');
import { ThumbnailColors } from '../types';

export async function extractColors(imageBuffer: Buffer, fallbackBgColor: string): Promise<ThumbnailColors> {
    try {
        const palette = await Vibrant.from(imageBuffer).getPalette();

        const primary = palette.Vibrant?.hex || fallbackBgColor;
        const dark = palette.DarkMuted?.hex || '#1a1a2e';
        const accent = palette.LightVibrant?.hex || '#ffffff';

        return { primary, dark, accent };
    } catch (error) {
        console.error('Color extraction failed, using defaults', error);
        return {
            primary: fallbackBgColor,
            dark: '#1a1a2e',
            accent: '#ffffff',
        };
    }
}
