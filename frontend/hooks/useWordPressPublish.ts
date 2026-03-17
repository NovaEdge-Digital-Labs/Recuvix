import { useState, useEffect, useCallback } from "react";
import {
    WPConnection,
    WPPublishHistory,
    StepStatus,
    WordPressErrorCode
} from "../lib/wordpress/wpTypes";
import { wpPublishHistoryManager } from "../lib/wordpress/wpPublishHistoryManager";
import { nanoid } from "nanoid";
import { useAuth } from "@/context/AuthContext";
import { wpConnectionsService } from "@/lib/db/wpConnectionsService";
import { mapSupabaseToWPConnection } from "@/lib/wordpress/wpSupabaseMapper";
import { blogsService } from "@/lib/db/blogsService";
import { toast } from "sonner";

interface PublishParams {
    connection: WPConnection;
    blogHtml: string;
    blogTitle: string;
    focusKeyword: string;
    secondaryKeywords: string[];
    metaTitle: string;
    metaDescription: string;
    slug: string;
    thumbnailUrl: string | null;
    categoryIds: number[];
    status: "draft" | "publish";
    injectYoastMeta: boolean;
    injectRankMathMeta: boolean;
}

export function useWordPressPublish() {
    const { user } = useAuth();
    const [connections, setConnections] = useState<WPConnection[]>([]);
    const [history, setHistory] = useState<WPPublishHistory[]>([]);

    // Publishing state
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStep, setPublishStep] = useState(0);
    const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([
        { step: 1, label: "Uploading featured image", status: "pending" },
        { step: 2, label: "Creating WordPress post", status: "pending" },
        { step: 3, label: "Setting categories and tags", status: "pending" },
        { step: 4, label: "Injecting SEO meta", status: "pending" },
    ]);
    const [publishResult, setPublishResult] = useState<any>(null);
    const [publishError, setPublishError] = useState<string | null>(null);

    // Load from localStorage & Supabase
    useEffect(() => {
        const localConns = wpPublishHistoryManager.getConnections();
        setConnections(localConns);
        setHistory(wpPublishHistoryManager.getHistory());

        if (user) {
            wpConnectionsService.getAll(user.id)
                .then(rows => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mapped = rows.map((r: any) => mapSupabaseToWPConnection(r));
                    setConnections(mapped);
                    // Update local storage with fresh data
                    wpPublishHistoryManager.saveConnections(mapped);
                })
                .catch(err => console.error("Failed to load WP connections from Supabase", err));
        }
    }, [user]);

    const saveConnections = (newConns: WPConnection[]) => {
        setConnections(newConns);
        wpPublishHistoryManager.saveConnections(newConns);
    };

    const addConnection = async (conn: Omit<WPConnection, "id" | "connectedAt">) => {
        const timestamp = new Date().toISOString();
        const id = nanoid();
        const newConn: WPConnection = {
            ...conn,
            id,
            connectedAt: timestamp,
        };

        const updatedConns = [newConn, ...connections].slice(0, 5);
        saveConnections(updatedConns);

        if (user) {
            try {
                await wpConnectionsService.save({
                    user_id: user.id,
                    label: conn.label,
                    site_url: conn.siteUrl,
                    username: conn.username,
                    app_password: conn.appPassword,
                    default_status: conn.defaultStatus,
                    default_category_id: conn.defaultCategory || null,
                    connected_at: timestamp
                });
            } catch (err) {
                console.error("Failed to sync new WP connection", err);
            }
        }
    };

    const removeConnection = async (id: string) => {
        saveConnections(connections.filter((c) => c.id !== id));
        if (user) {
            try {
                await wpConnectionsService.delete(id);
            } catch (err) {
                console.error("Failed to delete WP connection from Supabase", err);
            }
        }
    };

    const setDefaultConnection = async (id: string) => {
        const conn = connections.find(c => c.id === id);
        if (!conn) return;
        const others = connections.filter(c => c.id !== id);
        saveConnections([conn, ...others]);

        if (user) {
            try {
                await wpConnectionsService.setDefault(user.id, id);
            } catch (err) {
                console.error("Failed to set default WP connection in Supabase", err);
            }
        }
    };

    const updateStep = (step: number, status: StepStatus["status"], error?: string) => {
        setStepStatuses(prev => prev.map(s =>
            s.step === step ? { ...s, status, error } : s
        ));
        if (status === "loading") setPublishStep(step);
    };

    const resetPublishState = useCallback(() => {
        setIsPublishing(false);
        setPublishStep(0);
        setPublishResult(null);
        setPublishError(null);
        setStepStatuses([
            { step: 1, label: "Uploading featured image", status: "pending" },
            { step: 2, label: "Creating WordPress post", status: "pending" },
            { step: 3, label: "Setting categories and tags", status: "pending" },
            { step: 4, label: "Injecting SEO meta", status: "pending" },
        ]);
    }, []);

    const publishBlog = async (params: PublishParams) => {
        setIsPublishing(true);
        setPublishError(null);
        setPublishResult(null);

        try {
            let featuredImageId: number | null = null;

            // Step 1: Upload Image
            if (params.thumbnailUrl && params.thumbnailUrl.startsWith("http")) {
                updateStep(1, "loading");
                try {
                    const imgRes = await fetch("/api/wordpress/upload-image", {
                        method: "POST",
                        body: JSON.stringify({
                            siteUrl: params.connection.siteUrl,
                            username: params.connection.username,
                            appPassword: params.connection.appPassword,
                            imageUrl: params.thumbnailUrl,
                            fileName: `${params.slug || "blog"}.png`,
                            altText: params.focusKeyword || params.blogTitle,
                        }),
                    });
                    const imgData = await imgRes.json();
                    if (imgData.success) {
                        featuredImageId = imgData.mediaId;
                        updateStep(1, "done");
                    } else {
                        console.warn("Image upload failed:", imgData.error);
                        updateStep(1, "failed", imgData.error);
                        // Non-blocking
                    }
                } catch (e) {
                    updateStep(1, "failed", "Network error");
                }
            } else {
                updateStep(1, "skipped");
            }

            // Step 2 & 3: Create Post & Tags (Tags are now server-side in my route logic)
            updateStep(2, "loading");

            const pubRes = await fetch("/api/wordpress/publish", {
                method: "POST",
                body: JSON.stringify({
                    siteUrl: params.connection.siteUrl,
                    username: params.connection.username,
                    appPassword: params.connection.appPassword,
                    title: params.blogTitle,
                    content: params.blogHtml,
                    excerpt: params.metaDescription,
                    slug: params.slug,
                    status: params.status,
                    focusKeyword: params.focusKeyword,
                    metaTitle: params.metaTitle,
                    metaDescription: params.metaDescription,
                    categoryIds: params.categoryIds,
                    tags: params.secondaryKeywords,
                    featuredImageId,
                    authorId: params.connection.defaultAuthorId,
                    injectYoastMeta: params.injectYoastMeta,
                    injectRankMathMeta: params.injectRankMathMeta,
                    blogTitle: params.blogTitle,
                    generatedAt: new Date().toISOString(),
                }),
            });

            const pubData = await pubRes.json();

            if (!pubData.success) {
                updateStep(2, "failed", pubData.error);
                setPublishError(pubData.error);
                setIsPublishing(false);
                return;
            }

            updateStep(2, "done");

            // Step 3 (Taxonomy) - Server side handles it, so we mark done
            updateStep(3, "done");

            // Step 4: SEO Meta
            if (pubData.warning) {
                updateStep(4, "skipped", pubData.warning);
            } else if (params.injectYoastMeta || params.injectRankMathMeta) {
                updateStep(4, "done");
            } else {
                updateStep(4, "skipped");
            }

            // Success!
            const historyItem: WPPublishHistory = {
                id: nanoid(),
                connectionId: params.connection.id,
                siteUrl: params.connection.siteUrl,
                postId: pubData.postId,
                postUrl: pubData.postUrl,
                postEditUrl: pubData.postEditUrl,
                blogTitle: params.blogTitle,
                publishedAs: params.status,
                publishedAt: new Date().toISOString(),
                featuredImageId,
            };

            wpPublishHistoryManager.addHistoryItem(historyItem);
            setHistory(prev => [historyItem, ...prev].slice(0, 20));
            setPublishResult(pubData);

            // Notify user of publish success
            toast.success(
                params.status === 'publish' ? 'Blog published to WordPress! 🎉' : 'Draft saved to WordPress',
                { description: pubData.postUrl ? `View at ${pubData.postUrl}` : undefined }
            );

            // Sync with Supabase: update blog entry if it exists
            // We'll try to find a blog with this title in Supabase if we don't have an ID
            if (user) {
                // Ideally we'd have search_id or something, but title is a good proxy for now 
                // if we don't have explicit blog ID in params (which we should add later)
                blogsService.getByTitle(user.id, params.blogTitle)
                    .then((blog: any) => {
                        if (blog) {
                            blogsService.update(blog.id, {
                                has_wordpress_post: true,
                                wordpress_url: pubData.postUrl,
                                wordpress_post_id: pubData.postId
                            }).catch(e => console.error("Failed to update blog with WP info", e));
                        }
                    });
            }

            setIsPublishing(false);

        } catch (error: any) {
            console.error("Publishing error:", error);
            const msg = error.message || "An unexpected error occurred";
            setPublishError(msg);
            toast.error('WordPress publish failed', { description: msg });
            setIsPublishing(false);
        }
    };

    return {
        connections,
        history,
        addConnection,
        removeConnection,
        setDefaultConnection,
        isPublishing,
        publishStep,
        stepStatuses,
        publishResult,
        publishError,
        publishBlog,
        resetPublishState,
        getHistoryForBlog: wpPublishHistoryManager.getHistoryForBlog,
    };
}
