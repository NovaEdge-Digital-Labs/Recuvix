/**
 * Sanitizes edited HTML to prevent XSS attacks while preserving blog-safe semantic HTML.
 */
export function sanitizeEditedHtml(html: string): string {
    if (!html) return "";

    let sanitized = html;

    // 1. Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");

    // 2. Remove all event handlers (onclick, onerror, onload, etc.)
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*(["'])(?:(?!\1).)*\1/gi, "");
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");

    // 3. Remove javascript: URLs in href or src
    sanitized = sanitized.replace(/href\s*=\s*(["'])javascript:[^"']*\1/gi, 'href="#"');
    sanitized = sanitized.replace(/src\s*=\s*(["'])javascript:[^"']*\1/gi, 'src=""');

    // 4. Remove dangerous tags: iframe, object, embed, frame, frameset
    sanitized = sanitized.replace(/<(?:iframe|object|embed|frame|frameset)\b[^>]*>([\s\S]*?)<\/(?:iframe|object|embed|frame|frameset)>/gi, "");
    sanitized = sanitized.replace(/<(?:iframe|object|embed|frame|frameset)\b[^>]*\/?>/gi, "");

    // 5. Remove style attributes to prevent CSS injection (keep classes)
    // We allow style tags if they were part of the original blog, but 
    // inline style attributes on elements are often where malicious stuff hides.
    // However, some formatting might use it. For now, let's be strict.
    sanitized = sanitized.replace(/\s+style\s*=\s*(["'])(?:(?!\1).)*\1/gi, "");

    // 6. Ensure we keep our own placeholders: [BLOGIMAGE:...] and [INTERNALLINK:...]
    // No changes needed as they are text in HTML or part of safe attributes.

    return sanitized;
}
