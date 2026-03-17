/**
 * Extractor for blog excerpts from HTML content.
 * Strips HTML tags and trims to ~200 characters at word boundaries.
 */
export const extractExcerpt = (html: string, maxLen: number = 200): string => {
    if (!html) return '';

    // 1. Strip HTML tags
    const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (text.length <= maxLen) return text;

    // 2. Trim to maxLen and find last space to avoid cutting words
    const trimmed = text.slice(0, maxLen);
    const lastSpace = trimmed.lastIndexOf(' ');

    if (lastSpace === -1) return trimmed + '...';

    return trimmed.slice(0, lastSpace) + '...';
};
