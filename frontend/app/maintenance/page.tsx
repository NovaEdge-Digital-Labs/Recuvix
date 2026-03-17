import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';

export default function MaintenancePage() {
    return (
        <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-6">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `linear-gradient(#e8ff47 1px, transparent 1px), linear-gradient(90deg, #e8ff47 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="relative z-10 text-center max-w-2xl">
                <div className="w-20 h-20 bg-[#e8ff47]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#e8ff47]/20 rotate-3">
                    <Clock size={40} className="text-[#e8ff47]" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white font-syne mb-6">
                    We&apos;ll be right back
                </h1>

                <p className="text-gray-400 text-lg mb-10 font-outfit leading-relaxed">
                    Recuvix is currently undergoing scheduled maintenance to improve our
                    AI generation engines. We expect to be back online shortly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
                        <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Estimated Down Time</p>
                        <p className="text-white font-bold text-xl font-syne italic">~ 45 Minutes</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left">
                        <p className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-2">Current Status</p>
                        <p className="text-white font-bold text-xl font-syne italic">Updating Engines</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-white/5">
                    <Link
                        href="/status"
                        className="flex items-center gap-2 text-[#e8ff47] hover:underline font-medium"
                    >
                        Check Status Page
                        <ExternalLink size={16} />
                    </Link>
                    <p className="text-gray-600 font-outfit text-sm">
                        Follow us on <a href="https://twitter.com/recuvix" className="text-white hover:underline">Twitter</a> for updates.
                    </p>
                </div>
            </div>

            {/* Background orbs */}
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#e8ff47]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        </main>
    );
}
