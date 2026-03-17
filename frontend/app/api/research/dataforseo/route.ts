import { NextRequest, NextResponse } from "next/server";
import { dataForSeoRequestSchema } from "@/lib/validators/researchSchemas";
import { getDataForSeoLocation } from "@/lib/utils/dataforseoMapper";
import { checkRateLimit } from "@/lib/utils/rateLimiter";

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        // 2. Parse body
        const bodyText = await req.text();
        if (!bodyText) {
            return NextResponse.json({ error: "Body required" }, { status: 400 });
        }
        const body = JSON.parse(bodyText);

        // 3. Validate Inputs using Zod
        const validation = dataForSeoRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { login, password, keywords, country } = validation.data;
        const { location_name, language_name } = getDataForSeoLocation(country);

        // 4. Call DataForSEO API
        const response = await fetch("https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live", {
            method: "POST",
            headers: {
                Authorization: "Basic " + Buffer.from(login + ":" + password).toString("base64"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify([{
                keywords: keywords,
                location_name: location_name,
                language_name: language_name,
            }])
        });

        if (response.status === 401) {
            return NextResponse.json({ error: "Invalid DataForSEO credentials" }, { status: 401 });
        }

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `DataForSEO API error: ${response.status}`, details: errorText }, { status: 502 });
        }

        const data: { tasks?: Array<{ result?: Array<{ keyword: string; search_volume?: number; competition?: string; competition_index?: number; cpc?: number }> }> } = await response.json();
        const results = data.tasks?.[0]?.result || [];

        const volumes = results.map((item: { keyword: string; search_volume?: number; competition?: string; competition_index?: number; cpc?: number }) => ({
            keyword: item.keyword,
            searchVolume: item.search_volume || 0,
            competition: item.competition || "LOW",
            competitionIndex: item.competition_index || 0,
            cpc: item.cpc || 0,
        }));

        return NextResponse.json({
            volumes,
            source: "dataforseo"
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("DataForSEO API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
