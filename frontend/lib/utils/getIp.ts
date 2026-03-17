import { NextRequest } from 'next/server';

/**
 * Robustly gets the client IP address from a request.
 */
export function getIp(req: NextRequest): string {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return '127.0.0.1';
}
