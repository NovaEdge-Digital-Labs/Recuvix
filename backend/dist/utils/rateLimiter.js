"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRateLimit = checkRateLimit;
exports.cleanupRateLimitStore = cleanupRateLimitStore;
const store = {};
function checkRateLimit(ip, limit = 10, windowMs = 60000) {
    const now = Date.now();
    const record = store[ip];
    if (!record || record.expiresAt < now) {
        store[ip] = {
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
// Helper to clean up expired records occasionally to prevent memory leaks
function cleanupRateLimitStore() {
    const now = Date.now();
    for (const ip in store) {
        if (store[ip].expiresAt < now) {
            delete store[ip];
        }
    }
}
// Note: In Next.js App Router API routes, you can try calling cleanupRateLimitStore() occasionally.
