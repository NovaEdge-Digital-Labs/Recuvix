import { NextResponse } from "next/server";

/*
SETUP REQUIRED:
1. Go to console.cloud.google.com
2. Create a new project or select existing
3. Enable "Google Search Console API" in APIs & Services
4. Go to APIs & Services > Credentials > Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: 
   - http://localhost:3000/tracker/callback (development)
   - https://yourdomain.com/tracker/callback (production)
7. Copy Client ID to GOOGLE_CLIENT_ID in .env.local
8. Copy Client Secret to GOOGLE_CLIENT_SECRET in .env.local
9. Add NEXT_PUBLIC_APP_URL=http://localhost:3000 to .env.local
*/

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get("redirectUri");

    if (!redirectUri) {
        return NextResponse.json({ error: "redirectUri is required" }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return NextResponse.json({ error: "GOOGLE_CLIENT_ID is not configured" }, { status: 500 });
    }

    const scopes = [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
    ];

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", scopes.join(" "));
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return NextResponse.json({ authUrl: authUrl.toString() });
}
