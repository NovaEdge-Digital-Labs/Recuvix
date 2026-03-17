"use client";

import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import {
    getAuthUrl,
    refreshGSCToken,
    getKeywords,
    getPerformance,
    getSites
} from "@/lib/tracker/gscClient";
import {
    saveSnapshot,
    getSnapshots,
    getLatestSnapshot,
    GSCKeywordSnapshot
} from "@/lib/tracker/snapshotManager";
import { useAuth } from "@/context/AuthContext";
import { gscConfigService } from "@/lib/db/gscConfigService";
import { trackedBlogsService } from "@/lib/db/trackedBlogsService";
import { rankingService } from "@/lib/db/rankingService";
import { mapSupabaseToGSCConfig, mapSupabaseToTrackedBlog } from "@/lib/tracker/gscSupabaseMapper";

export interface GSCConfig {
    connected: boolean;
    accessToken: string;
    refreshToken: string;
    tokenExpiry: number; // Date.now() + expires_in * 1000
    siteUrl: string;
    connectedAt: string;
}

export interface TrackedBlog {
    id: string;
    title: string;
    url: string;
    slug: string;
    publishedAt: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    generatedAt?: string;
    recuvixOutputId?: string;
    addedAt: string;
    notes?: string;
}

const GSC_CONFIG_KEY = "recuvix_gsc_config";
const TRACKED_BLOGS_KEY = "recuvix_tracked_blogs";

export function useGSCData() {
    const { user } = useAuth();
    const [gscConfig, setGscConfig] = useState<GSCConfig | null>(null);
    const [trackedBlogs, setTrackedBlogs] = useState<TrackedBlog[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from localStorage & Supabase on mount
    useEffect(() => {
        const storedConfig = localStorage.getItem(GSC_CONFIG_KEY);
        const storedBlogs = localStorage.getItem(TRACKED_BLOGS_KEY);

        if (storedConfig) {
            try {
                setGscConfig(JSON.parse(storedConfig));
            } catch (e) { }
        }

        if (storedBlogs) {
            try {
                setTrackedBlogs(JSON.parse(storedBlogs));
            } catch (e) { }
        }

        if (user) {
            // Fetch fresh from Supabase
            gscConfigService.get(user.id)
                .then(row => {
                    if (row) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const config = mapSupabaseToGSCConfig(row as any);
                        setGscConfig(config);
                        localStorage.setItem(GSC_CONFIG_KEY, JSON.stringify(config));
                    }
                });

            trackedBlogsService.getAll(user.id)
                .then(rows => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mapped = rows.map((r: any) => mapSupabaseToTrackedBlog(r));
                    setTrackedBlogs(mapped);
                    localStorage.setItem(TRACKED_BLOGS_KEY, JSON.stringify(mapped));
                });
        }

        setIsHydrated(true);
    }, [user]);

    // Save config to localStorage & Supabase
    const saveConfig = useCallback(async (config: GSCConfig | null) => {
        setGscConfig(config);
        if (config) {
            localStorage.setItem(GSC_CONFIG_KEY, JSON.stringify(config));
            if (user) {
                try {
                    await gscConfigService.save({
                        user_id: user.id,
                        access_token: config.accessToken,
                        refresh_token: config.refreshToken,
                        token_expiry: new Date(config.tokenExpiry).toISOString(),
                        site_url: config.siteUrl
                    });
                } catch (err) {
                    console.error("Failed to sync GSC config to Supabase", err);
                }
            }
        } else {
            localStorage.removeItem(GSC_CONFIG_KEY);
            if (user) {
                await gscConfigService.delete(user.id);
            }
        }
    }, [user]);

    // Save blogs to localStorage
    const saveTrackedBlogs = useCallback((blogs: TrackedBlog[]) => {
        setTrackedBlogs(blogs);
        localStorage.setItem(TRACKED_BLOGS_KEY, JSON.stringify(blogs));
    }, []);

    const connectGSC = useCallback(async () => {
        try {
            setError(null);
            const redirectUri = `${window.location.origin}/tracker/callback`;
            const { authUrl } = await getAuthUrl(redirectUri);
            window.location.href = authUrl;
        } catch (err: any) {
            setError(err.message || "Failed to start Google connection");
        }
    }, []);

    const disconnectGSC = useCallback(() => {
        saveConfig(null);
    }, [saveConfig]);

    const refreshTokenIfNeeded = useCallback(async (): Promise<string> => {
        if (!gscConfig) throw new Error("GSC not connected");

        // Refresh 5 minutes early
        const needsRefresh = Date.now() >= gscConfig.tokenExpiry - 300000;

        if (!needsRefresh) return gscConfig.accessToken;

        try {
            const { accessToken, expiresIn } = await refreshGSCToken(gscConfig.refreshToken);
            const updatedConfig = {
                ...gscConfig,
                accessToken,
                tokenExpiry: Date.now() + expiresIn * 1000,
            };
            saveConfig(updatedConfig);
            return accessToken;
        } catch (err: any) {
            setError("Session expired. Please reconnect Google Search Console.");
            disconnectGSC();
            throw err;
        }
    }, [gscConfig, saveConfig, disconnectGSC]);

    const fetchSitesList = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = await refreshTokenIfNeeded();
            const { sites } = await getSites(token);
            return sites;
        } catch (err: any) {
            setError(err.message || "Failed to fetch site list");
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [refreshTokenIfNeeded]);

    const fetchLatestKeywords = useCallback(async (blogId: string, startDate: string, endDate: string) => {
        if (!gscConfig) return null;

        const blog = trackedBlogs.find(b => b.id === blogId);
        if (!blog) return null;

        try {
            setIsLoading(true);
            const token = await refreshTokenIfNeeded();
            const data = await getKeywords({
                accessToken: token,
                siteUrl: gscConfig.siteUrl,
                pageUrl: blog.url,
                startDate,
                endDate,
            });

            // Save as snapshot
            const snapshots: GSCKeywordSnapshot[] = data.keywords.map((k: any) => ({
                date: new Date().toISOString().split("T")[0],
                keyword: k.keyword,
                position: k.position,
                impressions: k.impressions,
                clicks: k.clicks,
                ctr: k.ctr,
                url: blog.url,
            }));

            saveSnapshot(blogId, snapshots);

            // Sync snapshots to Supabase if authenticated
            if (user) {
                for (const s of snapshots) {
                    rankingService.saveSnapshot({
                        user_id: user.id,
                        tracked_blog_id: blogId,
                        snapshot_date: s.date,
                        keyword: s.keyword,
                        position: s.position,
                        impressions: s.impressions,
                        clicks: s.clicks,
                        ctr: s.ctr
                    }).catch(err => console.error("Failed to sync snapshot", err));
                }
            }

            return data;
        } catch (err: any) {
            setError(err.message || "Failed to fetch keyword data");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [gscConfig, trackedBlogs, refreshTokenIfNeeded]);

    const importBlogs = useCallback(async (newBlogs: Omit<TrackedBlog, "id" | "addedAt">[]) => {
        const blogsToSave = [...trackedBlogs];
        const now = new Date().toISOString();
        const addedIds: string[] = [];

        for (const blog of newBlogs) {
            // Avoid duplicates
            if (blogsToSave.find(b => b.url === blog.url)) continue;

            const id = nanoid();
            const newTrackedBlog: TrackedBlog = {
                ...blog,
                id,
                addedAt: now,
            };
            blogsToSave.push(newTrackedBlog);
            addedIds.push(id);

            if (user) {
                try {
                    await trackedBlogsService.add({
                        id,
                        user_id: user.id,
                        title: blog.title,
                        url: blog.url,
                        slug: blog.slug,
                        published_at: blog.publishedAt,
                        focus_keyword: blog.focusKeyword,
                        secondary_keywords: blog.secondaryKeywords,
                        blog_id: blog.recuvixOutputId || null,
                        added_at: now
                    });
                } catch (err) {
                    console.error("Failed to sync tracked blog", err);
                }
            }
        }

        saveTrackedBlogs(blogsToSave);
        return addedIds;
    }, [trackedBlogs, saveTrackedBlogs, user]);

    return {
        gscConfig,
        trackedBlogs,
        isHydrated,
        isConnected: !!gscConfig?.connected,
        isLoading,
        error,
        connectGSC,
        disconnectGSC,
        saveConfig,
        saveTrackedBlogs,
        importBlogs,
        fetchSitesList,
        fetchLatestKeywords,
        refreshTokenIfNeeded,
        getSnapshots,
        getLatestSnapshot,
    };
}
