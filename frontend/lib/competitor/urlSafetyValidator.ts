import { URL } from 'url'

const BLOCKED_DOMAINS = [
    'google.com',
    'facebook.com',
    'twitter.com',
    'instagram.com',
    'linkedin.com',
    'youtube.com',
    'amazon.com'
]

const PRIVATE_IP_RANGES = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^::1$/,
    /^localhost$/i
]

export function validateCompetitorUrl(rawUrl: string): { valid: true, url: URL } | { valid: false, reason: string } {

    try {
        const parsed = new URL(rawUrl)

        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { valid: false, reason: 'Only HTTP/HTTPS URLs allowed' }
        }

        const hostname = parsed.hostname.toLowerCase()

        for (const pattern of PRIVATE_IP_RANGES) {
            if (pattern.test(hostname)) {
                return { valid: false, reason: 'Private/local addresses not allowed' }
            }
        }

        for (const blocked of BLOCKED_DOMAINS) {
            if (hostname === blocked || hostname.endsWith('.' + blocked)) {
                return { valid: false, reason: `${blocked} cannot be analyzed` }
            }
        }

        return { valid: true, url: parsed }
    } catch {
        return { valid: false, reason: 'Invalid URL format' }
    }
}
