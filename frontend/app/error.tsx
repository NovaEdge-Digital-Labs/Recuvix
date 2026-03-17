'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error('Application Error:', error);
    }, [error]);

    const isDev = process.env.NODE_ENV === 'development';

    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                <AlertTriangle size={40} className="text-red-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white font-syne mb-4">
                Something went wrong
            </h1>

            <p className="text-gray-400 max-w-md mx-auto text-lg mb-8 font-outfit">
                We encountered an unexpected error. Our team has been notified.
            </p>

            {isDev && (
                <div className="w-full max-w-2xl bg-red-500/5 border border-red-500/10 rounded-xl p-6 mb-10 text-left overflow-auto max-h-[300px] custom-scrollbar">
                    <p className="text-red-400 font-mono text-sm mb-2 font-bold uppercase tracking-wider">
                        Error Details (Development Only):
                    </p>
                    <pre className="text-red-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                        {error.message || 'No message provided'}
                        {error.stack && `\n\nStack Trace:\n${error.stack}`}
                    </pre>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 bg-[#e8ff47] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#d4e840] transition-all"
                >
                    <RotateCcw size={20} />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-transparent text-white border border-white/20 px-8 py-3 rounded-lg font-medium hover:bg-white/5 transition-all"
                >
                    <Home size={20} />
                    Go Home
                </Link>
            </div>

            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
        </main>
    );
}
