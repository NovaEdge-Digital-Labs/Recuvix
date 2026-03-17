import { NextRequest, NextResponse } from "next/server";
import { WPTestConnectionSchema } from "@/lib/validators/wordpressSchemas";
import { validateCompetitorUrl } from "@/lib/competitor/urlSafetyValidator";
import { wpRequest } from "@/lib/wordpress/wpApiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = WPTestConnectionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: result.error.format() },
                { status: 400 }
            );
        }

        const { siteUrl, username, appPassword } = result.data;

        // 1. SSRF Protection
        const safetyCheck = validateCompetitorUrl(siteUrl);
        if (!safetyCheck.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: safetyCheck.reason,
                    errorCode: "UNREACHABLE",
                    hint: "Could not connect to this URL. Check that the site is live and the URL is correct including https://"
                },
                { status: 403 }
            );
        }

        // 2. Normalize and Test Connection
        const normalizedUrl = siteUrl.replace(/\/$/, "");

        try {
            // Fetch WP REST API root
            const [siteInfo, userInfo, categories] = (await Promise.all([
                wpRequest({
                    siteUrl: normalizedUrl,
                    username,
                    appPassword,
                    endpoint: "/wp-json/",
                    method: "GET",
                }),
                wpRequest({
                    siteUrl: normalizedUrl,
                    username,
                    appPassword,
                    endpoint: "/wp-json/wp/v2/users/me?context=edit",
                    method: "GET",
                }),
                wpRequest({
                    siteUrl: normalizedUrl,
                    username,
                    appPassword,
                    endpoint: "/wp-json/wp/v2/categories?per_page=1",
                    method: "GET",
                }),
            ])) as [any, any, any];
            return NextResponse.json({
                success: true,
                siteTitle: siteInfo.name || "WordPress Site",
                siteDescription: siteInfo.description || "",
                wordpressVersion: "Detected", // WordPress hides this often, name/namespaces can clue
                authenticatedUser: {
                    id: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                },
                categories: categories.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    count: c.count,
                })),
                restApiUrl: `${normalizedUrl}/wp-json/`,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("[WP_TEST_ERROR]", err);

            let errorCode = "UNREACHABLE";
            let hint = "Could not connect to this URL. Check that the site is live and the URL is correct including https://";

            if (err.status === 401) {
                errorCode = "INVALID_CREDENTIALS";
                hint = "Check your username and application password. Application passwords look like: xxxx xxxx xxxx xxxx";
            } else if (err.status === 403) {
                errorCode = "APP_PASSWORDS_DISABLED";
                hint = "Application Passwords are disabled on this site. Ask your site admin to enable them, or add this line to wp-config.php: define('WP_APPLICATION_PASSWORDS_ENABLED', true)";
            } else if (err.status === 404) {
                errorCode = "NOT_WORDPRESS";
                hint = "This URL doesn't appear to be a WordPress site. Make sure you entered the root URL, not a page URL.";
            }

            return NextResponse.json({
                success: false,
                error: err.message || "Failed to connect to WordPress",
                errorCode,
                hint
            }, { status: 200 }); // Return 200 with success: false for clean frontend handling
        }
    } catch (error) {
        console.error("[WP_CONNECT_CRITICAL]", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
