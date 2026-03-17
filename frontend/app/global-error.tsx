'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-[#050505] text-white font-sans">
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Critical Application Error</h1>
                            <p className="text-neutral-400 text-sm">
                                A critical error occurred that prevented the application from starting.
                                Please try refreshing the page.
                            </p>
                        </div>
                        <button
                            onClick={() => reset()}
                            className="flex items-center justify-center gap-2 w-full h-11 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all"
                        >
                            <RotateCcw size={18} />
                            Refresh Page
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
