import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { modelId, apiKey } = await req.json();

        if (!modelId || !apiKey) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        let url = "";
        let headers: Record<string, string> = {};

        switch (modelId) {
            case "claude":
                url = "https://api.anthropic.com/v1/models";
                headers = {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                };
                break;
            case "openai":
                url = "https://api.openai.com/v1/models";
                headers = {
                    Authorization: `Bearer ${apiKey}`,
                };
                break;
            case "gemini":
                url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                break;
            case "grok":
                url = "https://api.x.ai/v1/models";
                headers = {
                    Authorization: `Bearer ${apiKey}`,
                };
                break;
            case "openrouter":
                url = "https://openrouter.ai/api/v1/models";
                headers = {
                    Authorization: `Bearer ${apiKey}`,
                };
                break;
            default:
                return NextResponse.json({ error: "Invalid model ID" }, { status: 400 });
        }

        const res = await fetch(url, {
            method: "GET",
            headers,
        });

        return NextResponse.json({ success: res.ok, status: res.status });
    } catch (error) {
        console.error("Validation proxy error:", error);
        return NextResponse.json({ error: "Connection failed" }, { status: 500 });
    }
}
