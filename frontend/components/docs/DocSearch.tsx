'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, ChevronRight } from 'lucide-react';
import { SEARCH_INDEX } from '@/lib/docs/search-index';

const DocSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(SEARCH_INDEX.slice(0, 5));
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                handleOpen();
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('open-search', handleOpen);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('open-search', handleOpen);
        };
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setResults(SEARCH_INDEX.slice(0, 5));
            return;
        }

        const filtered = SEARCH_INDEX.filter((item) => {
            const searchContent = `${item.title} ${item.description} ${item.category}`.toLowerCase();
            return searchContent.includes(query.toLowerCase());
        }).slice(0, 8);

        setResults(filtered);
        setActiveIndex(0);
    }, [query]);

    const handleNavigate = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            if (results[activeIndex]) {
                handleNavigate(results[activeIndex].href);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 sm:px-6">
            <div
                className="absolute inset-0 bg-[#000]/80 backdrop-blur-md"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-[#222] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center px-6 py-4 border-b border-[#222]">
                    <Search className="w-5 h-5 text-[#666]" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search documentation..."
                        className="flex-1 bg-transparent border-none outline-none px-4 text-[#f0f0f0] text-lg font-light"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-md hover:bg-white/5 text-[#444] hover:text-[#f0f0f0]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((result, index) => (
                                <button
                                    key={result.href}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${activeIndex === index
                                            ? 'bg-[#e8ff47]/10 border border-[#e8ff47]/20'
                                            : 'border border-transparent hover:bg-white/[0.03]'
                                        }`}
                                    onClick={() => handleNavigate(result.href)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-md bg-[#1a1a1a] text-[#666]">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-medium ${activeIndex === index ? 'text-[#e8ff47]' : 'text-[#f0f0f0]'}`}>
                                                    {result.title}
                                                </span>
                                                <span className="text-[10px] text-[#444] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#222]">
                                                    {result.category}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#666] line-clamp-1 mt-0.5">
                                                {result.description}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeIndex === index ? 'text-[#e8ff47] translate-x-1' : 'text-[#222]'}`} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-[#666] text-sm italic">No results found for "{query}"</p>
                        </div>
                    )}
                </div>

                <div className="px-6 py-3 border-t border-[#222] bg-[#0a0a0a] flex items-center justify-between text-[10px] text-[#444] font-mono uppercase tracking-[0.1em]">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-[#1a1a1a] border border-[#222]">↵</kbd> Select</span>
                        <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-[#1a1a1a] border border-[#222]">↑↓</kbd> Navigate</span>
                    </div>
                    <span className="flex items-center gap-1"><kbd className="px-1 rounded bg-[#1a1a1a] border border-[#222]">ESC</kbd> Close</span>
                </div>
            </div>
        </div>
    );
};

export default DocSearch;
