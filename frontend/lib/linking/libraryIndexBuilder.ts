import { extractBlogIndexInfo } from './linkExtractor';

export interface RawBlogRecord {
    id: string;
    title?: string;
    topic?: string;
    focus_keyword?: string;
    secondary_keywords?: string[];
    tags?: string[];
    country?: string;
    slug?: string;
    word_count?: number;
    created_at: string;
    link_index?: {
        h2s?: string[];
        firstParagraph?: string;
    };
    blog_html?: string;
}

export interface BlogIndexEntry {
    id: string;
    title: string;
    topic: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    tags: string[];
    country: string;
    slug: string | null;
    wordCount: number;
    createdAt: string;
    h2s: string[];               // extracted from HTML
    firstParagraph: string;      // first 300 chars plain
    existingOutboundLinks: string[]; // target blog IDs or URLs
}

/**
 * Builds a BlogIndexEntry from raw database blog record
 */
export function buildIndexEntry(blog: RawBlogRecord): BlogIndexEntry {
    // Use cached link_index if available and fresh enough? 
    // For now, extract fresh from HTML if provided
    const extracted = extractBlogIndexInfo(blog.blog_html || '');

    return {
        id: blog.id,
        title: blog.title || '',
        topic: blog.topic || '',
        focusKeyword: blog.focus_keyword || '',
        secondaryKeywords: blog.secondary_keywords || [],
        tags: blog.tags || [],
        country: blog.country || '',
        slug: blog.slug || null,
        wordCount: blog.word_count || 0,
        createdAt: blog.created_at,
        h2s: extracted.h2s,
        firstParagraph: extracted.firstParagraph,
        existingOutboundLinks: extracted.outboundUrls,
    };
}

/**
 * Builds the full library index for the linking engine
 */
export function buildLibraryIndex(blogs: RawBlogRecord[]): BlogIndexEntry[] {
    return blogs.map(blog => {
        // If link_index is already stored in DB, we can use it
        if (blog.link_index) {
            return {
                id: blog.id,
                title: blog.title || '',
                topic: blog.topic || '',
                focusKeyword: blog.focus_keyword || '',
                secondaryKeywords: blog.secondary_keywords || [],
                tags: blog.tags || [],
                country: blog.country || '',
                slug: blog.slug || null,
                wordCount: blog.word_count || 0,
                createdAt: blog.created_at,
                h2s: blog.link_index.h2s || [],
                firstParagraph: blog.link_index.firstParagraph || '',
                existingOutboundLinks: [], // Populated from separate query if needed
            };
        }
        return buildIndexEntry(blog);
    });
}
