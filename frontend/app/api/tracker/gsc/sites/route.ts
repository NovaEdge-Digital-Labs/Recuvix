import { NextResponse } from "next/server";
import { GSCSitesSchema } from "@/lib/validators/trackerSchemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = GSCSitesSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
        }

        const { accessToken } = result.data;

        const response = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || "Failed to fetch sites" }, { status: response.status });
        }

        // Filter to only show sites where permissionLevel is not "unverifiedUser"
        const sites = (data.siteEntry || [])
            .filter((site: { permissionLevel: string }) => site.permissionLevel !== "unverifiedUser")
            .map((site: { siteUrl: string; permissionLevel: string }) => ({
                siteUrl: site.siteUrl,
                permissionLevel: site.permissionLevel,
            }));

        return NextResponse.json({ sites });
    } catch (error) {
        console.error("GSC sites fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
