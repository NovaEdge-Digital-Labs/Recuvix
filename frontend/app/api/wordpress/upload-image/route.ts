import { NextRequest, NextResponse } from "next/server";
import { WPUploadImageSchema } from "@/lib/validators/wordpressSchemas";
import { validateCompetitorUrl } from "@/lib/competitor/urlSafetyValidator";
import { wpRequest } from "@/lib/wordpress/wpApiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = WPUploadImageSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: result.error.format() },
                { status: 400 }
            );
        }

        const { siteUrl, username, appPassword, imageUrl, fileName, altText, caption } = result.data;

        // 1. SSRF Protection
        const safetyCheck = validateCompetitorUrl(siteUrl);
        if (!safetyCheck.valid) {
            return NextResponse.json({ success: false, error: safetyCheck.reason }, { status: 403 });
        }

        // 2. Fetch image from Cloudinary
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image from source: ${imageResponse.statusText}`);
        }
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        // 3. Upload to WordPress Media Library
        // Use raw wpRequest logic but with binary body
        const normalizedUrl = siteUrl.replace(/\/$/, "");
        const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");

        const wpResponse = await fetch(`${normalizedUrl}/wp-json/wp/v2/media`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Disposition": `attachment; filename="${fileName}"`,
                "Content-Type": "image/png", // Assuming png as per prompt logic
            },
            body: imageBuffer,
        });

        if (!wpResponse.ok) {
            const errorData = await wpResponse.json().catch(() => ({}));
            return NextResponse.json({
                success: false,
                error: errorData.message || "Failed to upload image to WordPress",
            }, { status: 200 });
        }

        const media = await wpResponse.json();

        // 4. Update the media item's alt text and caption
        await wpRequest({
            siteUrl: normalizedUrl,
            username,
            appPassword,
            endpoint: `/wp-json/wp/v2/media/${media.id}`,
            method: "POST",
            body: {
                alt_text: altText,
                caption: caption ? { raw: caption } : undefined,
            },
        }).catch(err => console.error("Failed to update media meta:", err));

        return NextResponse.json({
            success: true,
            mediaId: media.id,
            mediaUrl: media.source_url,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("[WP_UPLOAD_ERROR]", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
