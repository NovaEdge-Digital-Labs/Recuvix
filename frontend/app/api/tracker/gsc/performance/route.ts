import { NextResponse } from "next/server";
import { GSCPerformanceSchema } from "@/lib/validators/trackerSchemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = GSCPerformanceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
        }

        const { accessToken, siteUrl, pageUrl, startDate, endDate, dimensions, rowLimit } = result.data;
        const encodedSiteUrl = encodeURIComponent(siteUrl);

        const response = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    startDate,
                    endDate,
                    dimensions,
                    ...(pageUrl ? {
                        dimensionFilterGroups: [
                            {
                                filters: [
                                    {
                                        dimension: "page",
                                        operator: "equals",
                                        expression: pageUrl,
                                    },
                                ],
                            },
                        ],
                    } : {}),
                    rowLimit,
                    dataState: "final",
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || "Failed to fetch performance data" }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("GSC performance fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
