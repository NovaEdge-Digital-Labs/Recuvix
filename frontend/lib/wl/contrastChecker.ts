function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

export function checkContrast(
    background: string,
    foreground: string
): {
    ratio: number,
    passAA: boolean,
    passAAA: boolean,
} {
    // Calculate relative luminance
    const lum = (hex: string) => {
        const rgb = hexToRgb(hex);
        const channels = [rgb.r, rgb.g, rgb.b].map(channel => {
            const c = channel / 255;
            return c <= 0.03928
                ? c / 12.92
                : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };

    const l1 = lum(background);
    const l2 = lum(foreground);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
        ratio: Math.round(ratio * 10) / 10,
        passAA: ratio >= 4.5,
        passAAA: ratio >= 7,
    };
}
