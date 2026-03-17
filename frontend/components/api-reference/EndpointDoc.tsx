'use client';

import React from 'react';
import MethodBadge from './MethodBadge';
import { Copy, Lock, Zap, CreditCard } from 'lucide-react';

interface EndpointHeaderProps {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    title: string;
    description: string;
    auth: boolean;
    streaming: boolean;
    credits: number;
}

const EndpointDoc: React.FC<EndpointHeaderProps> = ({
    method,
    path,
    title,
    description,
    auth,
    streaming,
    credits
}) => {
    const copyPath = () => {
        navigator.clipboard.writeText(`https://recuvix.in${path}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <MethodBadge method={method} />
                    <code className="text-sm font-mono text-[#666] select-all bg-white/[0.03] px-2 py-0.5 rounded">
                        {path}
                    </code>
                    <button
                        onClick={copyPath}
                        className="p-1 rounded hover:bg-white/5 text-[#333] hover:text-[#666] transition-colors"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                </div>
                <h1 className="text-3xl font-bold font-syne text-[#f0f0f0]">
                    {title}
                </h1>
                <p className="text-[#999] leading-relaxed max-w-xl">
                    {description}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                    {auth && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-[#111] text-[10px] font-mono text-[#666] uppercase tracking-wider">
                            <Lock className="w-3 h-3" />
                            Requires Auth
                        </div>
                    )}
                    {streaming && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/20 text-[10px] font-mono text-blue-500 uppercase tracking-wider">
                            <Zap className="w-3 h-3" />
                            Streaming SSE
                        </div>
                    )}
                    {credits > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8ff47]/5 border border-[#e8ff47]/20 text-[10px] font-mono text-[#e8ff47] uppercase tracking-wider">
                            <CreditCard className="w-3 h-3" />
                            Uses Credits
                        </div>
                    )}
                </div>
            </div>

            <div className="h-[1px] w-full bg-[#111]" />
        </div>
    );
};

export default EndpointDoc;
