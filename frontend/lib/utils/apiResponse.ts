import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown) {
    console.error("API Error:", error);

    if (error instanceof ZodError) {
        return NextResponse.json(
            { error: "Validation failed", details: error.issues },
            { status: 400 }
        );
    }

    // Handle specific external API errors if needed, e.g. based on error shape
    if (typeof error === 'object' && error !== null && 'service' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            { error: "External service unavailable", service: (error as any).service },
            { status: 502 }
        );
    }

    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
}

export function handleRateLimit() {
    return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
    );
}
