'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DOC_NAVIGATION } from '@/lib/docs/navigation';
import { ChevronRight } from 'lucide-react';

const DocsSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="docs-sidebar">
            <div className="px-6 space-y-8">
                {DOC_NAVIGATION.map((group) => (
                    <div key={group.group}>
                        <h4 className="flex items-center gap-2 mb-4 text-[11px] font-mono font-bold text-[#444] uppercase tracking-[0.15em]">
                            {group.group}
                        </h4>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        target={item.external ? '_blank' : undefined}
                                        className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all relative overflow-hidden ${isActive
                                                ? 'text-[#e8ff47] font-medium bg-[#e8ff47]/5'
                                                : 'text-[#666] hover:text-[#f0f0f0] hover:bg-white/[0.03]'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#e8ff47]" />
                                        )}
                                        <span className="relative z-10">{item.title}</span>
                                        {item.external && (
                                            <ChevronRight className="w-3 h-3 text-[#333] group-hover:text-[#666] transition-colors" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default DocsSidebar;
