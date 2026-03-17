'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Github, Disc as Discord, Menu } from 'lucide-react';

const DocsNavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-[#050505]/80 backdrop-blur-md border-[#111]' : 'bg-transparent border-transparent'
            }`}>
            <div className="max-w-[1440px] h-full mx-auto px-6 flex items-center justify-between">
                {/* Left: Logo & Badge */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-xl font-bold tracking-tighter text-[#f0f0f0] group-hover:text-[#e8ff47] transition-colors font-syne">
                            Recuvix
                        </span>
                    </Link>
                    <div className="h-4 w-[1px] bg-[#222]" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#f0f0f0] uppercase tracking-widest font-mono">Docs</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-[#e8ff47]/10 text-[#e8ff47] text-[10px] font-bold border border-[#e8ff47]/20">v1.0</span>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <button
                        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-[#222] rounded-lg hover:border-[#444] transition-all group"
                        onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
                    >
                        <div className="flex items-center gap-2 text-[#666] group-hover:text-[#999]">
                            <Search className="w-4 h-4" />
                            <span className="text-sm">Search docs...</span>
                        </div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#333] bg-[#0d0d0d] text-[10px] font-mono text-[#444]">
                            <span className="text-[12px]">⌘</span>K
                        </div>
                    </button>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="hidden sm:flex items-center text-xs font-mono text-[#666] hover:text-[#e8ff47] transition-colors"
                    >
                        ← Back to App
                    </Link>
                    <div className="hidden sm:block h-4 w-[1px] bg-[#222]" />
                    <div className="flex items-center gap-3">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-[#666] hover:text-[#f0f0f0] transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-[#666] hover:text-[#f0f0f0] transition-all">
                            <Discord className="w-5 h-5" />
                        </a>
                        <button className="md:hidden p-2 rounded-lg hover:bg-white/5 text-[#f0f0f0]">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DocsNavBar;
