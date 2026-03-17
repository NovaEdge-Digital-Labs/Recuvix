/**
 * Formats a slug into a nice title
 * e.g. "digital-marketing-tips" -> "Digital Marketing Tips"
 */
export function formatSlugToTitle(slug: string): string {
    return slug
        .split(/[-/]/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Extracts the last part of a URL as a slug
 */
export function extractSlugFromUrl(url: string): string {
    try {
        const path = new URL(url).pathname;
        const segments = path.split('/').filter(Boolean);
        return segments[segments.length - 1] || '';
    } catch {
        return '';
    }
}
