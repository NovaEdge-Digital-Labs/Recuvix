import { ThumbnailColors } from '@/lib/types';

export async function extractColors(imageBuffer: Buffer, fallbackBgColor: string): Promise<ThumbnailColors> {
    try {
        // @ts-expect-error - node-vibrant lacks proper v3 types
        const Vibrant = (await import('node-vibrant')).default || (await import('node-vibrant'));
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
