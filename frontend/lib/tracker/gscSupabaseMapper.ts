import { GSCConfig, TrackedBlog } from "@/hooks/useGSCData";
import { Database } from "../supabase/types";

type GscConfigRow = Database['public']['Tables']['gsc_configs']['Row'];
type TrackedBlogRow = Database['public']['Tables']['tracked_blogs']['Row'];

export const mapSupabaseToGSCConfig = (row: GscConfigRow): GSCConfig => {
    return {
        connected: true,
        accessToken: row.access_token,
        refreshToken: row.refresh_token,
        tokenExpiry: new Date(row.token_expiry).getTime(),
        siteUrl: row.site_url,
        connectedAt: row.updated_at || ''
    };
};

export const mapSupabaseToTrackedBlog = (row: TrackedBlogRow): TrackedBlog => {
    return {
        id: row.id,
        title: row.title,
        url: row.url || "",
        slug: row.slug || "",
        publishedAt: row.published_at || "",
        focusKeyword: row.focus_keyword,
        secondaryKeywords: row.secondary_keywords || [],
        recuvixOutputId: row.blog_id || undefined,
        addedAt: row.added_at,
        notes: undefined // No notes in DB yet
    };
};
