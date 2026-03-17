'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Globe, ChevronRight } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/api-reference/endpoints';
import MethodBadge from './MethodBadge';

const ApiSidebar = () => {
    const pathname = usePathname();
    const [filter, setFilter] = useState('');

    const groups = Array.from(new Set(API_ENDPOINTS.map(e => e.group)));

    const filteredEndpoints = API_ENDPOINTS.filter(e =>
        e.path.toLowerCase().includes(filter.toLowerCase()) ||
        e.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <aside className="w-64 min-w-64 h-full border-r border-[#111] bg-[#050505] flex flex-col overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-[#111]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444]" />
                    <input
                        type="text"
                        placeholder="Filter endpoints..."
                        className="w-full bg-[#0d0d0d] border border-[#111] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#999] outline-none focus:border-[#222]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="px-4 py-2 border-b border-[#111] flex items-center justify-between text-[10px] bg-[#030303]">
                <div className="flex items-center gap-1.5 text-green-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono uppercase tracking-wider">Systems v1.0 Operational</span>
                </div>
            </div>

            {/* Endpoints */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
                {groups.map(group => {
                    const endpointsInGroup = filteredEndpoints.filter(e => e.group === group);
                    if (endpointsInGroup.length === 0) return null;

                    return (
                        <div key={group}>
                            <h4 className="text-[10px] font-mono font-bold text-[#333] uppercase tracking-[0.2em] mb-4">
                                {group}
                            </h4>
                            <div className="space-y-1">
                                {endpointsInGroup.map(endpoint => {
                                    const href = `/docs/api/endpoints/${endpoint.id.replace(/-/g, '/')}`;
                                    const isActive = pathname === href;

                                    return (
                                        <Link
                                            key={endpoint.id}
                                            href={href}
                                            className={`flex items-center gap-3 px-2 py-1.5 rounded-md text-xs font-mono transition-all group ${isActive
                                                    ? 'bg-[#e8ff47]/5 text-[#e8ff47] border-l-2 border-[#e8ff47] -ml-2 pl-4'
                                                    : 'text-[#666] hover:text-[#999] hover:bg-white/[0.02]'
                                                }`}
                                        >
                                            <MethodBadge method={endpoint.method} />
                                            <span className="truncate">{endpoint.path}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default ApiSidebar;
