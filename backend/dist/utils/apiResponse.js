"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = handleApiError;
exports.handleRateLimit = handleRateLimit;
const server_1 = require("next/server");
const zod_1 = require("zod");
function handleApiError(error) {
    console.error("API Error:", error);
    if (error instanceof zod_1.ZodError) {
        return server_1.NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    // Handle specific external API errors if needed, e.g. based on error shape
    if (typeof error === 'object' && error !== null && 'service' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return server_1.NextResponse.json(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        { error: "External service unavailable", service: error.service }, { status: 502 });
    }
    return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
function handleRateLimit() {
    return server_1.NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
