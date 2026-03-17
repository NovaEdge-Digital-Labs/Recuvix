'use client';

import Link from 'next/link';

export function AuthButtons() {
    return (
        <div className="flex items-center gap-2">
            <Link
                href="/login"
                className="h-8 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                Sign In
            </Link>
            <Link
                href="/signup"
                className="h-8 px-4 text-sm font-bold bg-[#e8ff47] text-black rounded-lg hover:bg-[#d4e840] transition-colors flex items-center"
            >
                Sign Up
            </Link>
        </div>
    );
}
