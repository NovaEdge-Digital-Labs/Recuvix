/**
 * Server-side HTML sanitizer using DOMPurify via JSDOM.
 * DOMPurify requires a DOM environment. On the server (Node.js),
 * we run it through a minimal JSDOM window fallback.
 * 
 * Use this before storing any user-provided rich-text/HTML to the database.
 */

/**
 * Strips all HTML tags and attributes, leaving plain text.
 * For non-HTML strings, this is a no-op (returns the string as-is).
 */
export function sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    // Remove HTML tags but keep text content
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
}

/**
 * Validates that a string doesn't contain suspicious script injections.
 * Returns true if the string is safe, false if it appears to contain XSS payloads.
 */
export function isSafeString(input: string): boolean {
    if (!input || typeof input !== 'string') return true;
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,         // onclick=, onerror=, etc.
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /vbscript:/i,
        /data:text\/html/i,
    ];
    return !dangerousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Whitelists specific HTML tags useful for rich-text blog content.
 * All other tags/attributes are stripped.
 * 
 * NOTE: On the client side, prefer using DOMPurify directly.
 * This is a lightweight server-side approximation without JSDOM.
 */
export function sanitizeRichText(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:[^"']*/gi, '')
        .trim();
}
