import { NextResponse } from "next/server";
import { ExchangeTokenSchema } from "@/lib/validators/trackerSchemas";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = ExchangeTokenSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 });
        }

        const { code, redirectUri } = result.data;
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: "Google OAuth credentials not configured" }, { status: 500 });
        }

        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error_description || data.error || "Failed to exchange token" }, { status: response.status });
        }

        return NextResponse.json({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
            tokenType: data.token_type,
        });
    } catch (error) {
        console.error("Token exchange error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
