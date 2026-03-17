import { NextRequest, NextResponse } from "next/server";
import { WPPublishSchema } from "@/lib/validators/wordpressSchemas";
import { validateCompetitorUrl } from "@/lib/competitor/urlSafetyValidator";
import { wpRequest } from "@/lib/wordpress/wpApiClient";
import { cleanBlogHtmlForWordPress } from "@/lib/wordpress/wpContentCleaner";
import { getOrCreateTagIds } from "@/lib/wordpress/wpTagManager";
import { buildYoastMeta, buildRankMathMeta } from "@/lib/wordpress/wpSeoMetaInjector";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = WPPublishSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: result.error.format() },
                { status: 400 }
            );
        }

        const data = result.data;
        const { siteUrl, username, appPassword } = data;

        // 1. SSRF Protection
        const safetyCheck = validateCompetitorUrl(siteUrl);
        if (!safetyCheck.valid) {
            return NextResponse.json({ success: false, error: safetyCheck.reason }, { status: 403 });
        }

        // 2. Content Cleaning
        const cleanedContent = cleanBlogHtmlForWordPress(data.content);

        // 3. Create the Post (Step 1 & 2)
        const normalizedUrl = siteUrl.replace(/\/$/, "");

        let postId: number;
        let postUrl: string;
        let postEditUrl: string;

        try {
            const wpBody = {
                title: { raw: data.title },
                content: { raw: cleanedContent },
                excerpt: data.excerpt ? { raw: data.excerpt } : undefined,
                slug: data.slug,
                status: data.status,
                author: data.authorId || undefined,
                categories: data.categoryIds.length > 0 ? data.categoryIds : [1],
                featured_media: data.featuredImageId || 0,
            };

            const postResponse = (await wpRequest({
                siteUrl: normalizedUrl,
                username,
                appPassword,
                endpoint: "/wp-json/wp/v2/posts",
                method: "POST",
                body: wpBody,
            })) as any;

            postId = postResponse.id;
            postUrl = postResponse.link;
            postEditUrl = `${normalizedUrl}/wp-admin/post.php?post=${postId}&action=edit`;
        } catch (err: any) {
            return NextResponse.json({
                success: false,
                error: err.message || "Failed to create WordPress post",
                errorCode: "CREATE_POST_FAILED",
                step: "create_post"
            }, { status: 200 });
        }

        // 4. Handle Tags (Step 3)
        if (data.tags && data.tags.length > 0) {
            try {
                const tagIds = await getOrCreateTagIds({
                    siteUrl: normalizedUrl,
                    username,
                    appPassword,
                    tags: data.tags
                });

                if (tagIds.length > 0) {
                    await wpRequest({
                        siteUrl: normalizedUrl,
                        username,
                        appPassword,
                        endpoint: `/wp-json/wp/v2/posts/${postId}`,
                        method: "POST",
                        body: { tags: tagIds },
                    });
                }
            } catch (err) {
                console.error("Failed to update tags:", err);
            }
        }

        // 5. Inject SEO Meta (Step 4 & 5)
        let warning: string | undefined;

        if (data.injectYoastMeta || data.injectRankMathMeta) {
            try {
                const meta: Record<string, string> = {};

                if (data.injectYoastMeta) {
                    Object.assign(meta, buildYoastMeta({
                        metaTitle: data.metaTitle,
                        metaDescription: data.metaDescription,
                        focusKeyword: data.focusKeyword,
                        slug: data.slug || "",
                    }));
                }

                if (data.injectRankMathMeta) {
                    Object.assign(meta, buildRankMathMeta({
                        metaTitle: data.metaTitle,
                        metaDescription: data.metaDescription,
                        focusKeyword: data.focusKeyword,
                    }));
                }

                await wpRequest({
                    siteUrl: normalizedUrl,
                    username,
                    appPassword,
                    endpoint: `/wp-json/wp/v2/posts/${postId}`,
                    method: "POST",
                    body: { meta },
                });

            } catch (err) {
                console.error("Failed to inject SEO meta:", err);
                warning = "SEO meta could not be set — Yoast SEO or RankMath plugin may not be installed on this WordPress site.";
            }
        }

        return NextResponse.json({
            success: true,
            postId,
            postUrl,
            postEditUrl,
            status: data.status,
            title: data.title,
            warning
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[WP_PUBLISH_ERROR]", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
