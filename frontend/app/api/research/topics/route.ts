import { NextRequest, NextResponse } from "next/server";
import { researchTopicRequestSchema } from "@/lib/validators/researchSchemas";
import { generateResearchTopics } from "@/lib/services/researchService";
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
        const validation = researchTopicRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.format() },
                { status: 400 }
            );
        }

        // 4. Call Service
        const topics = await generateResearchTopics(validation.data);

        // 5. Return response
        return NextResponse.json({
            topics,
            model: validation.data.llmProvider,
            niche: validation.data.niche,
            country: validation.data.country,
            generatedAt: new Date().toISOString()
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("Research API Error:", error);
        const message = error instanceof Error ? error.message : "";

        if (message === "Invalid API key") {
            return NextResponse.json({ error: "Invalid API key set in preferences" }, { status: 401 });
        }
        if (message.includes("Rate limit")) {
            return NextResponse.json({ error: "Rate limit hit. Please try again in a few minutes." }, { status: 429 });
        }

        return NextResponse.json({ error: message || "Failed to generate research topics" }, { status: 500 });
    }
}
