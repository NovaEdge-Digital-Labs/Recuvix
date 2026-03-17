import { NextRequest, NextResponse } from "next/server";
import { outlineGenerateSchema } from "@/lib/validators/outlineSchemas";
import { generateOutline } from "@/lib/services/outlineService";
import { checkRateLimit } from "@/lib/utils/rateLimiter";

export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        }

        // Parse body
        const bodyText = await req.text();
        if (!bodyText) {
            return NextResponse.json({ error: "Body required" }, { status: 400 });
        }
        const body = JSON.parse(bodyText);

        // Validate with Zod
        const validation = outlineGenerateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.format() },
                { status: 400 }
            );
        }

        // Call service
        const outline = await generateOutline(validation.data);

        return NextResponse.json(outline, { status: 200 });

    } catch (error: unknown) {
        console.error("Outline API Error:", error);

        const message = error instanceof Error ? error.message : "Unknown error";

        if (message === "Invalid API key") {
            return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
        }
        if (message.includes("Rate limited")) {
            return NextResponse.json({ error: "Rate limited. Try again shortly." }, { status: 429 });
        }
        if (message.startsWith("JSON_PARSE_FAILURE:")) {
            const raw = message.replace("JSON_PARSE_FAILURE:", "");
            return NextResponse.json(
                { error: "Outline generation failed", raw },
                { status: 502 }
            );
        }

        return NextResponse.json({ error: message || "Failed to generate outline" }, { status: 500 });
    }
}
