/**
 * URL Safety Validator — blocks SSRF attempts.
 * Checks for localhost, private/internal IP ranges, and cloud metadata endpoints.
 */

const BLOCKED_HOSTNAMES = new Set([
    'localhost',
    'metadata.google.internal',
    'metadata.internal',
    '169.254.169.254', // AWS/Azure metadata
]);

const ALLOWED_PROTOCOLS = new Set(['https:', 'http:']);

/**
 * Returns false if the URL is considered unsafe (SSRF risk).
 */
export function isUrlSafe(rawUrl: string): boolean {
    let parsed: URL;

    try {
        parsed = new URL(rawUrl);
    } catch {
        return false; // Invalid URL
    }

    // Block unsafe protocols
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
        return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block known dangerous hostnames
    if (BLOCKED_HOSTNAMES.has(hostname)) {
        return false;
    }

    // Block IPv6 localhost
    if (hostname === '::1' || hostname === '[::1]') {
        return false;
    }

    // Block private IPv4 ranges using dotted-decimal parsing
    const parts = hostname.split('.').map(Number);
    if (parts.length === 4 && parts.every((p) => !isNaN(p))) {
        const [a, b] = parts;

        // 127.x.x.x — loopback
        if (a === 127) return false;
        // 10.x.x.x — private Class A
        if (a === 10) return false;
        // 172.16.x.x – 172.31.x.x — private Class B
        if (a === 172 && b >= 16 && b <= 31) return false;
        // 192.168.x.x — private Class C
        if (a === 192 && b === 168) return false;
        // 169.254.x.x — link-local (cloud metadata)
        if (a === 169 && b === 254) return false;
    }

    return true;
}
