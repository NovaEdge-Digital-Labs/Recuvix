import { WPConnection } from "./wpTypes";
import { Database } from "../supabase/types";

type WPConnectionRow = Database['public']['Tables']['wordpress_connections']['Row'];

export const mapSupabaseToWPConnection = (row: WPConnectionRow): WPConnection => {
    return {
        id: row.id,
        label: row.label,
        siteUrl: row.site_url,
        username: row.username,
        appPassword: row.app_password,
        connected: !!row.last_tested_at,
        lastTestedAt: row.last_tested_at || '',
        wordpressVersion: row.wordpress_version || '',
        siteTitle: row.site_title || row.label,
        siteDescription: '',
        defaultStatus: row.default_status as 'draft' | 'publish',
        defaultCategory: row.default_category_id || null,
        defaultAuthorId: (row.authors as any)?.[0]?.id || null,
        categories: (row.categories as any) || [],
        authors: (row.authors as any) || [],
        connectedAt: row.connected_at
    };
};
