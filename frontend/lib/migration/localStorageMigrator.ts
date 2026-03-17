import { blogsService } from '@/lib/db/blogsService';
import { apiKeysService } from '@/lib/db/apiKeysService';
import { wpConnectionsService } from '@/lib/db/wpConnectionsService';
import { researchService } from '@/lib/db/researchService';

export interface MigrationResult {
    blogs: { success: number; failed: number };
    apiKeys: { success: number; failed: number };
    wpConnections: { success: number; failed: number };
    research: { success: number; failed: number };
}

export interface LocalDataSummary {
    blogCount: number;
    hasApiKeys: boolean;
    wpConnectionCount: number;
    researchCount: number;
}

export function detectLocalData(): LocalDataSummary {
    if (typeof window === 'undefined') {
        return { blogCount: 0, hasApiKeys: false, wpConnectionCount: 0, researchCount: 0 };
    }

    const historyIndex = localStorage.getItem('recuvix_history_index');
    const apiConfig = localStorage.getItem('recuvix_api_config');
    const wpConnectionsRaw = localStorage.getItem('recuvix_wp_connections');
    const researchRaw = localStorage.getItem('recuvix_research_history');

    const blogCount = historyIndex ? (JSON.parse(historyIndex) as unknown[]).length : 0;
    const hasApiKeys = !!apiConfig && (JSON.parse(apiConfig)?.apiKey != null);
    const wpConnectionCount = wpConnectionsRaw ? (JSON.parse(wpConnectionsRaw) as unknown[]).length : 0;
    const researchCount = researchRaw ? (JSON.parse(researchRaw) as unknown[]).length : 0;

    return { blogCount, hasApiKeys, wpConnectionCount, researchCount };
}

export async function migrateLocalDataToSupabase(
    userId: string,
    options: { blogs: boolean; apiKeys: boolean; wpConnections: boolean; research: boolean },
    onProgress?: (msg: string) => void
): Promise<MigrationResult> {
    const result: MigrationResult = {
        blogs: { success: 0, failed: 0 },
        apiKeys: { success: 0, failed: 0 },
        wpConnections: { success: 0, failed: 0 },
        research: { success: 0, failed: 0 },
    };

    // --- Migrate Blogs ---
    if (options.blogs) {
        try {
            const indexRaw = localStorage.getItem('recuvix_history_index');
            const index: Array<{
                id: string;
                title: string;
                topic: string;
                country: string;
                model: string;
                wordCount: number;
                createdAt: number;
                isStarred?: boolean;
                tags?: string[];
                isPublished?: boolean;
                wordpressUrl?: string;
            }> = indexRaw ? JSON.parse(indexRaw) : [];

            for (let i = 0; i < index.length; i++) {
                const entry = index[i];
                onProgress?.(`Importing blog ${i + 1} of ${index.length}: "${entry.title}"`);
                try {
                    const contentRaw = localStorage.getItem(`recuvix_history_content_${entry.id}`);
                    const content: {
                        blogHtml: string;
                        blogMarkdown: string;
                        seoMeta: Record<string, unknown>;
                        thumbnailUrl: string;
                        generationInput: Record<string, unknown>;
                    } | null = contentRaw ? JSON.parse(contentRaw) : null;

                    await blogsService.create({
                        user_id: userId,
                        title: entry.title,
                        topic: entry.topic,
                        country: entry.country || 'usa',
                        model: entry.model || 'unknown',
                        word_count: entry.wordCount || 0,
                        is_starred: entry.isStarred || false,
                        tags: entry.tags || [],
                        has_wordpress_post: entry.isPublished || false,
                        wordpress_url: entry.wordpressUrl || null,
                        blog_html: content?.blogHtml || null,
                        blog_markdown: content?.blogMarkdown || null,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        seo_meta: (content?.seoMeta as any) || null,
                        meta_title: (content?.seoMeta?.metaTitle as string) || null,
                        meta_description: (content?.seoMeta?.metaDescription as string) || null,
                        slug: (content?.seoMeta?.slug as string) || null,
                        thumbnail_url: content?.thumbnailUrl || null,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        generation_input: (content?.generationInput as any) || null,
                        excerpt: content?.blogHtml
                            ? content.blogHtml.replace(/<[^>]+>/g, '').slice(0, 200)
                            : null,
                        created_at: new Date(entry.createdAt).toISOString(),
                    });
                    result.blogs.success++;
                } catch {
                    result.blogs.failed++;
                }
            }
        } catch {
            // Couldn't parse history index
        }
    }

    // --- Migrate API Keys ---
    if (options.apiKeys) {
        try {
            const apiConfigRaw = localStorage.getItem('recuvix_api_config');
            if (apiConfigRaw) {
                const config: { selectedModel: string; apiKey: string } = JSON.parse(apiConfigRaw);
                if (config.selectedModel && config.apiKey) {
                    onProgress?.(`Importing API key for ${config.selectedModel}`);
                    try {
                        await apiKeysService.saveKey(
                            userId,
                            config.selectedModel as 'claude' | 'openai' | 'gemini' | 'grok',
                            config.apiKey
                        );
                        result.apiKeys.success++;
                    } catch {
                        result.apiKeys.failed++;
                    }
                }
            }
        } catch {
            // ignore
        }
    }

    // --- Migrate WordPress Connections ---
    if (options.wpConnections) {
        try {
            const wpRaw = localStorage.getItem('recuvix_wp_connections');
            const connections: Array<{
                id?: string;
                label: string;
                siteUrl: string;
                username: string;
                appPassword: string;
                defaultStatus?: string;
            }> = wpRaw ? JSON.parse(wpRaw) : [];

            for (const conn of connections) {
                onProgress?.(`Importing WordPress connection: ${conn.label || conn.siteUrl}`);
                try {
                    await wpConnectionsService.save({
                        user_id: userId,
                        label: conn.label || conn.siteUrl,
                        site_url: conn.siteUrl,
                        username: conn.username,
                        app_password: conn.appPassword,
                        default_status: (conn.defaultStatus as 'draft' | 'publish' | 'pending') || 'draft',
                    });
                    result.wpConnections.success++;
                } catch {
                    result.wpConnections.failed++;
                }
            }
        } catch {
            // ignore
        }
    }

    // --- Migrate Research History ---
    if (options.research) {
        try {
            const researchRaw = localStorage.getItem('recuvix_research_history');
            const sessions: Array<{
                niche: string;
                country: string;
                topics: unknown[];
                model: string;
                createdAt?: number;
            }> = researchRaw ? JSON.parse(researchRaw) : [];

            for (const session of sessions) {
                onProgress?.(`Importing research: ${session.niche}`);
                try {
                    await researchService.save({
                        user_id: userId,
                        niche: session.niche,
                        country: session.country,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        topics: session.topics as any,
                        model: session.model || 'unknown',
                        created_at: session.createdAt ? new Date(session.createdAt).toISOString() : undefined,
                    });
                    result.research.success++;
                } catch {
                    result.research.failed++;
                }
            }
        } catch {
            // ignore
        }
    }

    return result;
}

export function clearLocalData() {
    if (typeof window === 'undefined') return;
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('recuvix_'));
    keys.forEach((k) => localStorage.removeItem(k));
}
