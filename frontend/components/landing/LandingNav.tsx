'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export function LandingNav() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[#050505]/80 backdrop-blur-[20px] border-b border-white/5 py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1">
                    <span className="font-['Bebas_Neue'] text-2xl tracking-wide text-[#e8ff47]">RECU</span>
                    <span className="font-['Bebas_Neue'] text-2xl tracking-wide text-white">VIX</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-8">
                    <Link href="/features" className="text-sm text-[#f0f0f0] hover:text-[#e8ff47] transition-colors">
                        Features
                    </Link>
                    <Link href="/pricing" className="text-sm text-[#f0f0f0] hover:text-[#e8ff47] transition-colors">
                        Pricing
                    </Link>
                    <Link href="/how-it-works" className="text-sm text-[#f0f0f0] hover:text-[#e8ff47] transition-colors">
                        How it Works
                    </Link>
                    <Link href="/white-label" className="text-sm text-[#f0f0f0] hover:text-[#e8ff47] transition-colors">
                        White Label
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-[#f0f0f0] hover:text-white px-4 py-2 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/signup"
                        className="text-sm font-['Bebas_Neue'] tracking-wider text-black bg-[#e8ff47] px-6 py-2.5 rounded-[4px] hover:bg-[#d4ed36] transition-all magnetic-button"
                        style={{ boxShadow: "0 0 20px rgba(232,255,71,0.15)" }}
                    >
                        Start Free &rarr;
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        {mobileMenuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 top-[72px] bg-[#050505] z-40 flex flex-col p-6 lg:hidden">
                    <div className="flex flex-col gap-6 text-2xl font-['Bebas_Neue'] tracking-wide">
                        <Link href="/features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                        <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                        <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
                        <Link href="/white-label" onClick={() => setMobileMenuOpen(false)}>White Label</Link>
                    </div>
                    <div className="mt-8 flex flex-col gap-4">
                        <Link
                            href="/login"
                            className="text-center text-lg border border-white/20 py-3 rounded-[4px]"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="text-center text-lg font-['Bebas_Neue'] text-black bg-[#e8ff47] py-3 rounded-[4px]"
                        >
                            Start Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default LandingNav;
