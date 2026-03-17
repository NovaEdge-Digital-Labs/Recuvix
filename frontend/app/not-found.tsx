import Link from 'next/link';
import { MoveLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `linear-gradient(#e8ff47 1px, transparent 1px), linear-gradient(90deg, #e8ff47 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative z-10 text-center">
                <h1 className="text-[120px] md:text-[200px] font-bold leading-none select-none text-[#e8ff47] opacity-20 font-bebas">
                    404
                </h1>

                <div className="mt-[-40px] md:mt-[-60px]">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-syne mb-4">
                        Page not found
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto text-lg mb-10 font-outfit">
                        The page you&apos;re looking for doesn&apos;t exist
                        or has been moved.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 bg-[#e8ff47] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#d4e840] transition-all"
                        >
                            <MoveLeft size={20} />
                            Go Home
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center gap-2 bg-transparent text-white border border-white/20 px-8 py-3 rounded-lg font-medium hover:border-[#e8ff47]/40 hover:text-[#e8ff47] transition-all"
                        >
                            <HelpCircle size={20} />
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>

            {/* Accent light glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e8ff47]/5 rounded-full blur-[120px] pointer-events-none" />
        </main>
    );
}
