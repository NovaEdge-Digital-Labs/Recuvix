/**
 * GSC Client Helpers
 * Manages calls to the /api/tracker/gsc/* endpoints
 */

export async function getAuthUrl(redirectUri: string) {
    const resp = await fetch(`/api/tracker/gsc/auth-url?redirectUri=${encodeURIComponent(redirectUri)}`);
    if (!resp.ok) throw new Error("Failed to get auth URL");
    return resp.json();
}

export async function exchangeCode(code: string, redirectUri: string) {
    const resp = await fetch("/api/tracker/gsc/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirectUri }),
    });
    if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || "Failed to exchange code");
    }
    return resp.json();
}

export async function refreshGSCToken(refreshToken: string) {
    const resp = await fetch("/api/tracker/gsc/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });
    if (!resp.ok) throw new Error("Failed to refresh token");
    return resp.json();
}

export async function getSites(accessToken: string) {
    const resp = await fetch("/api/tracker/gsc/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
    });
    if (!resp.ok) throw new Error("Failed to fetch sites");
    return resp.json();
}

export async function getPerformance(params: {
    accessToken: string;
    siteUrl: string;
    pageUrl?: string;
    startDate: string;
    endDate: string;
    dimensions?: string[];
    rowLimit?: number;
}) {
    const resp = await fetch("/api/tracker/gsc/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    if (!resp.ok) throw new Error("Failed to fetch performance data");
    return resp.json();
}

export async function getKeywords(params: {
    accessToken: string;
    siteUrl: string;
    pageUrl: string;
    startDate: string;
    endDate: string;
    rowLimit?: number;
}) {
    const resp = await fetch("/api/tracker/gsc/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    if (!resp.ok) throw new Error("Failed to fetch keywords");
    return resp.json();
}

export async function analyzePerformance(params: unknown) {
    const resp = await fetch("/api/tracker/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });
    if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || "AI analysis failed");
    }
    return resp.json();
}
