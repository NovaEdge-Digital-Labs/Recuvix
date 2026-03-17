/**
 * Cleans Recuvix generated HTML for WordPress compatibility.
 */
export function cleanBlogHtmlForWordPress(html: string): string {
    if (!html) return "";

    let cleaned = html;

    // 1. Remove <style> blocks (WP has its own themes/styles)
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, "");

    // 2. Strip outer <article> wrapper but keep content
    // Regex to find start of <article> and end of </article>
    cleaned = cleaned.replace(/^[\s\S]*?<article[^>]*>/i, "");
    cleaned = cleaned.replace(/<\/article>[\s\S]*$/i, "");

    // 3. Remove the first <h1>...</h1> occurrence (WP uses post title)
    cleaned = cleaned.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");

    // 4. Clean up excessive blank lines (3 or more)
    cleaned = cleaned.replace(/(\n\s*){3,}/g, "\n\n");

    // 5. Trim whitespace
    cleaned = cleaned.trim();

    return cleaned;
}
