// Simple in-memory rate limiter for V1
type RateLimitStore = Record<string, { count: number; expiresAt: number }>;

const store: RateLimitStore = {};

const LOCALHOST_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

/**
 * Checks the rate limit for a given key (e.g., IP + action).
 * @param ip User IP address
 * @param actionName Name of the action for specific limiting
 * @param limit Max allowed requests
 * @param windowMs Time window in milliseconds (default 1 hour)
 */
export function checkRateLimit(
    ip: string,
    actionName: string = "global",
    limit: number = 60,
    windowMs: number = 3600000 // Default 1 hour
): boolean {
    // Bypass rate limiting for localhost in development
    if (process.env.NODE_ENV === "development" && LOCALHOST_IPS.has(ip)) {
        return true;
    }

    const key = `${ip}:${actionName}`;
    const now = Date.now();
    const record = store[key];

    if (!record || record.expiresAt < now) {
        store[key] = {
            count: 1,
            expiresAt: now + windowMs,
        };
        return true; // Allowed
    }

    if (record.count >= limit) {
        return false; // Rate limited
    }

    record.count += 1;
    return true; // Allowed
}

// Helper to clean up expired records occasionally
export function cleanupRateLimitStore() {
    const now = Date.now();
    for (const key in store) {
        if (store[key].expiresAt < now) {
            delete store[key];
        }
    }
}
