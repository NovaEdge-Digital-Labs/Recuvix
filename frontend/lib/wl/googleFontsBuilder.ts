export function buildGoogleFontsUrl(headingFont: string, bodyFont: string): string {
    const fonts = [];
    if (headingFont) fonts.push(`family=${headingFont.replace(/ /g, '+')}:wght@400;700`);
    if (bodyFont && bodyFont !== headingFont) fonts.push(`family=${bodyFont.replace(/ /g, '+')}:wght@400;500;700`);

    if (fonts.length === 0) return '';

    return `https://fonts.googleapis.com/css2?${fonts.join('&')}&display=swap`;
}
