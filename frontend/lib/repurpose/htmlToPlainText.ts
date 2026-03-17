/**
 * Converts blog HTML to plain text for use in LLM prompts.
 * Strips script/style tags, preserves heading structure, converts lists to bullets,
 * and collapses whitespace.
 */
export function htmlToPlainText(html: string): string {
    if (!html) return '';

    return html
        // Remove style/script blocks
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        // Convert headings to text with markers
        .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n## $1\n\n')
        // Convert paragraphs
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
        // Convert list items
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n• $1')
        // Convert breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // Remove remaining HTML tags
        .replace(/<[^>]+>/g, '')
        // Decode HTML entities
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        // Clean up whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
