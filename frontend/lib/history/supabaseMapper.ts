import { HistoryIndexEntry } from "./historySearch";
import { HistoryContent } from "./historyManager";
import { Database } from "../supabase/types";

type BlogRow = Database['public']['Tables']['blogs']['Row'];

export const mapSupabaseToHistoryEntry = (row: BlogRow): HistoryIndexEntry => {
    return {
        id: row.id,
        title: row.title,
        topic: row.topic,
        focusKeyword: row.focus_keyword,
        country: row.country,
        wordCount: row.word_count,
        format: (row.format as any) || "html",
        model: row.model,
        createdAt: row.created_at,
        lastViewedAt: row.last_viewed_at,
        isStarred: row.is_starred,
        tags: row.tags || [],
        thumbnailUrl: row.thumbnail_url || null,
        metaTitle: ((row.seo_meta as any)?.metaTitle) || row.title,
        metaDescription: ((row.seo_meta as any)?.metaDescription) || "",
        hasWordPressPost: !!row.wordpress_post_id,
        wordPressUrl: row.wordpress_url || null,
        editCount: row.edit_count || 0,
        generationTime: row.generation_time_seconds || 0,
        storageKey: `recuvix_history_content_${row.id}`,
        excerpt: row.excerpt || ""
    };
};

export const mapSupabaseToHistoryContent = (row: BlogRow): HistoryContent => {
    return {
        id: row.id,
        blogHtml: row.blog_html || "",
        blogMarkdown: row.blog_markdown || "",
        seoMeta: row.seo_meta,
        generationInput: row.generation_input,
        editHistory: (row.edit_history as any[]) || [],
        approvedOutline: row.approved_outline || null
    };
};
