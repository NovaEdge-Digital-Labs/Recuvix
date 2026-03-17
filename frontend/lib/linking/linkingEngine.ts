import { nanoid } from 'nanoid';
import { BlogIndexEntry } from './libraryIndexBuilder';
import { htmlToPlainText } from '../repurpose/htmlToPlainText';

export type PlacementType = 'keyword_match' | 'placeholder' | 'heading_match' | 'semantic_match';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected' | 'applied';

export interface ScoreBreakdown {
    keywordOverlap: number;      // 0-40
    topicSimilarity: number;     // 0-30
    countryMatch: number;        // 0-15
    contentFreshness: number;    // 0-10
    notAlreadyLinked: number;    // 0-5
    total: number;               // 0-100
}

export interface LinkSuggestion {
    id: string;                  // nanoid()
    sourceBlogId: string;
    targetBlogId: string;
    targetTitle: string;
    targetSlug: string | null;
    targetUrl: string;
    targetFocusKeyword: string;
    anchorText: string;
    contextSentence: string;
    sectionH2: string | null;
    placementType: PlacementType;
    relevanceScore: number;
    scoreBreakdown: ScoreBreakdown;
    status: SuggestionStatus;
}

export interface AnchorOpportunity {
    anchorText: string;
    contextSentence: string;
    sectionH2: string | null;
    placementType: PlacementType;
    confidence: number;
}

// ─── SCORING ───────────────────────────────

export function scoreRelevance(
    source: BlogIndexEntry,
    target: BlogIndexEntry
): ScoreBreakdown {

    // 1. Keyword overlap (0-40)
    const sourceKeywords = normaliseKeywords([
        source.focusKeyword,
        ...source.secondaryKeywords,
        ...source.h2s,
        source.topic,
    ]);
    const targetKeywords = normaliseKeywords([
        target.focusKeyword,
        ...target.secondaryKeywords,
        target.topic,
        target.title,
    ]);
    const overlap = sourceKeywords.filter(
        k => targetKeywords.some(
            tk => tk.includes(k) || k.includes(tk)
        )
    ).length;
    const keywordScore = Math.min(40, overlap * 8);

    // 2. Topic similarity (0-30)
    const sourceWords = tokenise(source.topic + ' ' + source.title);
    const targetWords = tokenise(target.topic + ' ' + target.title);
    const sharedWords = sourceWords.filter(
        w => targetWords.includes(w) && w.length > 4  // skip short words
    );
    const topicScore = Math.min(30, sharedWords.length * 6);

    // 3. Country match (0-15)
    const countryScore = source.country === target.country ? 15 : 0;

    // 4. Content freshness (0-10)
    const ageInDays = Math.floor(
        (Date.now() - new Date(target.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const freshnessScore =
        ageInDays < 30 ? 10 :
            ageInDays < 90 ? 5 : 0;

    // 5. Not already linked (0-5)
    const notLinkedScore = source.existingOutboundLinks.includes(target.id) ? 0 : 5;

    const total = keywordScore + topicScore + countryScore + freshnessScore + notLinkedScore;

    return {
        keywordOverlap: keywordScore,
        topicSimilarity: topicScore,
        countryMatch: countryScore,
        contentFreshness: freshnessScore,
        notAlreadyLinked: notLinkedScore,
        total,
    };
}

// ─── ANCHOR TEXT FINDER ────────────────────

export function findAnchorOpportunities(
    sourceBlogHtml: string,
    target: BlogIndexEntry,
    maxPerTarget: number = 2
): AnchorOpportunity[] {

    const plainText = htmlToPlainText(sourceBlogHtml);
    const opportunities: AnchorOpportunity[] = [];

    // Priority 1: [INTERNALLINK: ...] placeholders
    const placeholderRegex = /\[INTERNALLINK:\s*([^|]+)\|([^\]]+)\]/g;
    let match;
    while ((match = placeholderRegex.exec(sourceBlogHtml)) !== null) {
        const anchorText = match[1].trim();
        const suggestedTopic = match[2].trim();
        if (topicsRelated(suggestedTopic, target.topic)) {
            opportunities.push({
                anchorText,
                contextSentence: extractSentenceContaining(plainText, anchorText),
                sectionH2: findContainingH2(sourceBlogHtml, match.index),
                placementType: 'placeholder',
                confidence: 95,
            });
        }
    }

    // Priority 2: Target's focusKeyword in source
    const focusKw = target.focusKeyword.toLowerCase();
    if (focusKw && focusKw.length > 3) {
        const kwRegex = new RegExp('\\b' + escapeRegex(focusKw) + '\\b', 'gi');
        const kwMatches = Array.from(plainText.matchAll(kwRegex));
        for (const m of kwMatches.slice(0, 2)) {
            const sentence = extractSentenceContaining(plainText, m[0] as string, m.index!);
            // Skip if sentence already has a link
            if (sentenceHasLinkInHtml(sourceBlogHtml, sentence)) continue;
            opportunities.push({
                anchorText: m[0] as string,
                contextSentence: sentence,
                sectionH2: findSectionForOffset(sourceBlogHtml, m.index!),
                placementType: 'keyword_match',
                confidence: 85,
            });
        }
    }

    // Priority 3: Target's secondary keywords
    for (const kw of target.secondaryKeywords.slice(0, 3)) {
        if (kw.length < 4) continue;
        const kwLower = kw.toLowerCase();
        const idx = plainText.toLowerCase().indexOf(kwLower);
        if (idx === -1) continue;
        const sentence = extractSentenceContaining(plainText, kw, idx);
        if (sentenceHasLinkInHtml(sourceBlogHtml, sentence)) continue;
        opportunities.push({
            anchorText: kw,
            contextSentence: sentence,
            sectionH2: findSectionForOffset(sourceBlogHtml, idx),
            placementType: 'keyword_match',
            confidence: 70,
        });
    }

    // Priority 4: H2 heading matches
    const targetTitleWords = tokenise(target.title);
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    while ((match = h2Regex.exec(sourceBlogHtml)) !== null) {
        const h2Text = match[1].replace(/<[^>]+>/g, '').trim();
        const h2Words = tokenise(h2Text);
        const shared = targetTitleWords.filter(
            w => h2Words.includes(w) && w.length > 4);
        if (shared.length >= 2) {
            opportunities.push({
                anchorText: shared.join(' '),
                contextSentence: h2Text,
                sectionH2: h2Text,
                placementType: 'heading_match',
                confidence: 60,
            });
        }
    }

    // Return top opportunities, no duplicates
    return deduplicateByAnchorText(opportunities)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, maxPerTarget);
}

// ─── MAIN ENGINE FUNCTION ──────────────────

export function computeLinkSuggestions(
    sourceBlog: BlogIndexEntry & { html: string },
    allBlogs: BlogIndexEntry[],
    baseUrl: string,
    options: {
        minScore?: number;         // default 35
        maxSuggestions?: number;   // default 8
        maxPerTarget?: number;     // default 2
    } = {}
): LinkSuggestion[] {

    const minScore = options.minScore ?? 35;
    const maxSuggestions = options.maxSuggestions ?? 8;
    const maxPerTarget = options.maxPerTarget ?? 2;

    const suggestions: LinkSuggestion[] = [];

    // Score all other blogs
    const scored = allBlogs
        .filter(b => b.id !== sourceBlog.id)
        .map(target => ({
            target,
            score: scoreRelevance(sourceBlog, target),
        }))
        .filter(s => s.score.total >= minScore)
        .sort((a, b) => b.score.total - a.score.total)
        .slice(0, maxSuggestions * 2);
    // Take 2x to have buffer after anchor finding

    // Find anchor text for top targets
    for (const { target, score } of scored) {
        const anchors = findAnchorOpportunities(sourceBlog.html, target, maxPerTarget);

        for (const anchor of anchors) {
            const targetUrl = baseUrl && target.slug
                ? baseUrl.replace(/\/$/, '') + '/blog/' + target.slug
                : '[URL_PLACEHOLDER]';

            suggestions.push({
                id: nanoid(),
                sourceBlogId: sourceBlog.id,
                targetBlogId: target.id,
                targetTitle: target.title,
                targetSlug: target.slug,
                targetUrl,
                targetFocusKeyword: target.focusKeyword,
                anchorText: anchor.anchorText,
                contextSentence: anchor.contextSentence,
                sectionH2: anchor.sectionH2,
                placementType: anchor.placementType,
                relevanceScore: score.total,
                scoreBreakdown: score,
                status: 'pending',
            });
        }

        if (suggestions.length >= maxSuggestions) break;
    }

    return suggestions.slice(0, maxSuggestions);
}

// ─── HELPER UTILITIES ─────────────────────

const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in',
    'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been',
    'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may',
    'this', 'that', 'these', 'those', 'it', 'its',
    'how', 'what', 'why', 'when', 'where', 'who',
]);

function normaliseKeywords(arr: string[]): string[] {
    return arr
        .flatMap(s => tokenise(s))
        .filter(w => w.length > 3 && !STOP_WORDS.has(w))
        .map(w => w.toLowerCase());
}

function tokenise(text: string): string[] {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 0);
}

function extractSentenceContaining(
    text: string,
    phrase: string,
    offset: number = 0
): string {
    const start = Math.max(0, text.lastIndexOf('.', offset) + 1);
    const end = text.indexOf('.', offset + phrase.length);
    const sentence = text.slice(
        start, end === -1 ? text.length : end + 1
    ).trim();
    return sentence.slice(0, 200);
    // Cap at 200 chars for display
}

function findContainingH2(html: string, offset: number): string | null {
    const before = html.slice(0, offset);
    const h2Match = before.match(/<h2[^>]*>([\s\S]*?)<\/h2>(?![\s\S]*<h2)/i);
    if (!h2Match) return null;
    return h2Match[1].replace(/<[^>]+>/g, '').trim();
}

function findSectionForOffset(html: string, textOffset: number): string | null {
    // Build a plain-text-to-HTML offset mapping
    // (simplified: find the last H2 before this offset in the plain text)
    const h2s: { text: string, offset: number }[] = [];
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    let match;
    while ((match = h2Regex.exec(html)) !== null) {
        h2s.push({
            text: match[1].replace(/<[^>]+>/g, '').trim(),
            offset: match.index
        });
    }

    const lastH2 = h2s.reverse().find(h => h.offset < textOffset);
    return lastH2 ? lastH2.text : null;
}

function sentenceHasLinkInHtml(html: string, sentence: string): boolean {
    const escaped = sentence.slice(0, 50)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const contextRegex = new RegExp(escaped, 'i');
    const htmlSection = html.match(contextRegex);
    if (!htmlSection) return false;
    const idx = html.indexOf(htmlSection[0]);
    const surroundingHtml = html.slice(
        Math.max(0, idx - 100), idx + 200);
    return /<a\s/i.test(surroundingHtml);
}

function topicsRelated(topic1: string, topic2: string): boolean {
    const words1 = tokenise(topic1).filter(w => !STOP_WORDS.has(w));
    const words2 = tokenise(topic2).filter(w => !STOP_WORDS.has(w));
    return words1.some(w => words2.includes(w));
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function deduplicateByAnchorText(arr: AnchorOpportunity[]): AnchorOpportunity[] {
    const seen = new Set<string>();
    return arr.filter(a => {
        const key = a.anchorText.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
