import { NextRequest, NextResponse } from "next/server";
import { WPFetchMetadataSchema } from "@/lib/validators/wordpressSchemas";
import { validateCompetitorUrl } from "@/lib/competitor/urlSafetyValidator";
import { wpRequest } from "@/lib/wordpress/wpApiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = WPFetchMetadataSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: result.error.format() },
                { status: 400 }
            );
        }

        const { siteUrl, username, appPassword } = result.data;

        const safetyCheck = validateCompetitorUrl(siteUrl);
        if (!safetyCheck.valid) {
            return NextResponse.json({ success: false, error: safetyCheck.reason }, { status: 403 });
        }

        const normalizedUrl = siteUrl.replace(/\/$/, "");

        const [categories, users] = (await Promise.all([
            wpRequest({
                siteUrl: normalizedUrl,
                username,
                appPassword,
                endpoint: "/wp-json/wp/v2/categories?per_page=100",
                method: "GET",
            }).catch(() => []),
            wpRequest({
                siteUrl: normalizedUrl,
                username,
                appPassword,
                endpoint: "/wp-json/wp/v2/users?per_page=50&context=edit",
                method: "GET",
            }).catch(() => []),
        ])) as [any[], any[]];

        return NextResponse.json({
            categories: categories.map((c: any) => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                count: c.count,
            })),
            authors: users.map((u: any) => ({
                id: u.id,
                name: u.name,
                slug: u.slug,
                avatarUrl: u.avatar_urls?.["96"] || "",
            })),
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[WP_METADATA_ERROR]", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
