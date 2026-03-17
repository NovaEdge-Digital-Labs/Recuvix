'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAdjacentPages } from '@/lib/docs/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DocsFooterNav = () => {
    const pathname = usePathname();
    const { prev, next } = getAdjacentPages(pathname);

    if (!prev && !next) return null;

    return (
        <div className="docs-footer-nav">
            <div className="flex-1">
                {prev && (
                    <Link href={prev.href} className="docs-nav-card group flex flex-col items-start">
                        <span className="nav-label flex items-center gap-1 group-hover:text-[#666]">
                            <ChevronLeft className="w-3 h-3" />
                            Previous
                        </span>
                        <span className="nav-title">{prev.title}</span>
                    </Link>
                )}
            </div>
            <div className="flex-1 flex justify-end">
                {next && (
                    <Link href={next.href} className="docs-nav-card group flex flex-col items-end text-right">
                        <span className="nav-label flex items-center gap-1 group-hover:text-[#666]">
                            Next
                            <ChevronRight className="w-3 h-3" />
                        </span>
                        <span className="nav-title">{next.title}</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default DocsFooterNav;
