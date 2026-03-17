import { NextResponse } from "next/server";
import { GSCKeywordsSchema } from "@/lib/validators/trackerSchemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = GSCKeywordsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
        }

        const { accessToken, siteUrl, pageUrl, startDate, endDate, rowLimit } = result.data;
        const encodedSiteUrl = encodeURIComponent(siteUrl);

        // To calculate trend, we'd ideally fetch two periods. 
        // For now, we'll fetch the requested period and compute rankStatus.
        // Real trend calculation would happen in the frontend or by fetching more data.

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
                    dimensions: ["query"],
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
                    rowLimit,
                    dataState: "final",
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error?.message || "Failed to fetch keywords" }, { status: response.status });
        }

        const keywords = (data.rows || []).map((row: { position: number; keys: string[]; impressions: number; clicks: number; ctr: number }) => {
            const position = row.position;
            let rankStatus = "low";
            if (position <= 3) rankStatus = "top3";
            else if (position <= 10) rankStatus = "top10";
            else if (position <= 20) rankStatus = "page2";

            return {
                keyword: row.keys[0],
                position: row.position,
                impressions: row.impressions,
                clicks: row.clicks,
                ctr: row.ctr,
                rankStatus,
                trend: "unknown", // placeholder for now
            };
        });

        return NextResponse.json({
            keywords,
            pageUrl,
            dateRange: { startDate, endDate },
            totalKeywords: keywords.length,
        });
    } catch (error) {
        console.error("GSC keywords fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
