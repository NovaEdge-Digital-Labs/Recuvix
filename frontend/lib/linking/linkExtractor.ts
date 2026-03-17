/**
 * Utility for extracting metadata and content structures from blog HTML
 * for the Internal Linking Engine.
 */

export interface ExtractedBlogInfo {
    h2s: string[];
    firstParagraph: string;
    outboundUrls: string[];
}

export function extractBlogIndexInfo(html: string): ExtractedBlogInfo {
    if (!html) {
        return { h2s: [], firstParagraph: '', outboundUrls: [] };
    }

    // 1. Extract H2 headings
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    const h2s: string[] = [];
    let m;
    while ((m = h2Regex.exec(html)) !== null) {
        const text = m[1].replace(/<[^>]+>/g, '').trim();
        if (text) h2s.push(text);
    }

    // 2. Extract first paragraph (plain text, first 300 chars)
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const firstParagraph = pMatch
        ? pMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 300)
        : '';

    // 3. Extract existing outbound links
    const linkRegex = /href="([^"]+)"/gi;
    const outboundUrls: string[] = [];
    while ((m = linkRegex.exec(html)) !== null) {
        const url = m[1];
        // Skip anchor links, mailto, etc.
        if (!url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:')) {
            outboundUrls.push(url);
        }
    }

    return {
        h2s,
        firstParagraph,
        outboundUrls,
    };
}
