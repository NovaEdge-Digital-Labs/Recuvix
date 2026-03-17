import { LinkSuggestion } from './linkingEngine';

/**
 * Applies approved suggestions to blog HTML.
 */
export function injectLinks(
    blogHtml: string,
    approvedSuggestions: LinkSuggestion[]
): {
    modifiedHtml: string,
    appliedCount: number,
    skippedCount: number,
    skippedReasons: string[],
} {

    let html = blogHtml;
    let appliedCount = 0;
    let skippedCount = 0;
    const skippedReasons: string[] = [];
    const linkedPhrases = new Set<string>();
    // Track to avoid linking same phrase twice

    // Sort by confidence descending
    const sorted = [...approvedSuggestions]
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

    for (const suggestion of sorted) {
        const { anchorText, targetUrl, placementType } = suggestion;

        if (linkedPhrases.has(anchorText.toLowerCase())) {
            skippedCount++;
            skippedReasons.push(`"${anchorText}" already linked`);
            continue;
        }

        if (placementType === 'placeholder') {
            // Replace [INTERNALLINK: anchor | topic]
            const placeholderRegex = new RegExp(
                `\\[INTERNALLINK:\\s*${escapeRegex(anchorText)}\\s*\\|[^\\]]+\\]`, 'i'
            );
            const newHtml = html.replace(
                placeholderRegex,
                `<a href="${targetUrl}" ` +
                `title="${suggestion.targetTitle}"` +
                ` rel="noopener">${anchorText}</a>`
            );
            if (newHtml !== html) {
                html = newHtml;
                appliedCount++;
                linkedPhrases.add(anchorText.toLowerCase());
                continue;
            }
        }

        // Find the first unlinked occurrence of anchorText in a paragraph 
        // (not in heading, not already inside an <a> tag)
        const anchorLower = anchorText.toLowerCase();
        const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
        let pMatch;
        let replaced = false;

        while ((pMatch = pRegex.exec(html)) !== null && !replaced) {
            const pContent = pMatch[1];
            const pLower = pContent.toLowerCase();
            const kwIdx = pLower.indexOf(anchorLower);

            if (kwIdx === -1) continue;

            // Check not inside an existing <a> tag
            const beforeKw = pContent.slice(0, kwIdx);
            const openAs = (beforeKw.match(/<a\s/gi) || []).length;
            const closeAs = (beforeKw.match(/<\/a>/gi) || []).length;
            if (openAs > closeAs) continue;
            // Inside an existing link — skip

            // Find exact case-preserving match
            const exactMatch = pContent.slice(kwIdx, kwIdx + anchorText.length);

            const linkedParagraph = pContent.slice(0, kwIdx) +
                `<a href="${targetUrl}" ` +
                `title="${suggestion.targetTitle}"` +
                ` rel="noopener">${exactMatch}</a>` +
                pContent.slice(kwIdx + anchorText.length);

            const fullP = pMatch[0].replace(pContent, linkedParagraph);
            html = html.slice(0, pMatch.index) +
                fullP +
                html.slice(pMatch.index + pMatch[0].length);

            appliedCount++;
            linkedPhrases.add(anchorLower);
            replaced = true;
        }

        if (!replaced) {
            skippedCount++;
            skippedReasons.push(`"${anchorText}" not found in paragraphs`);
        }
    }

    return { modifiedHtml: html, appliedCount, skippedCount, skippedReasons };
}

/**
 * Removes a specific applied link from a blog HTML.
 */
export function removeLinkFromHtml(
    blogHtml: string,
    anchorText: string,
    targetUrl: string
): string {
    // Find <a href="targetUrl">anchorText</a> and replace with just anchorText
    const linkRegex = new RegExp(
        `<a[^>]*href="${escapeRegex(targetUrl)}"[^>]*>${escapeRegex(anchorText)}<\/a>`, 'gi'
    );
    return blogHtml.replace(linkRegex, anchorText);
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
