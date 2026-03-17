/**
 * Helper to make authenticated requests to WordPress REST API from the backend proxy.
 */
export async function wpRequest<T = unknown>(params: {
    siteUrl: string;
    username: string;
    appPassword: string;
    endpoint: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: BodyInit | Record<string, unknown>;
}): Promise<T> {
    const { siteUrl, username, appPassword, endpoint, method = "GET", body } = params;

    // Normalize site URL (strip trailing slash)
    const baseUrl = siteUrl.replace(/\/$/, "");
    const url = `${baseUrl}${endpoint}`;

    const auth = Buffer.from(`${username}:${appPassword}`).toString("base64");

    const headers: Record<string, string> = {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
    };

    if (body && !(body instanceof Buffer)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        method,
        headers,
        body: body && typeof body === "object" && !(body instanceof Buffer) ? JSON.stringify(body) : (body as BodyInit),
        // Add a reasonable timeout
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw {
            status: response.status,
            message: errorData.message || response.statusText,
            data: errorData,
        };
    }

    return response.json();
}
