'use client';

import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import JsonViewer from './JsonViewer';
import { Copy, Download, Terminal, Wifi, WifiOff } from 'lucide-react';

interface ResponseViewerProps {
    status: 'idle' | 'loading' | 'streaming' | 'success' | 'error';
    data?: any;
    statusCode?: number;
    headers?: Record<string, string>;
    streamedText?: string;
    chunkCount?: number;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({
    status,
    data,
    statusCode = 200,
    headers = {},
    streamedText = '',
    chunkCount = 0
}) => {
    const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'preview'>('body');

    if (status === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#111] rounded-xl text-[#444]">
                <Terminal className="w-8 h-8 mb-3 opacity-20" />
                <p className="text-sm font-mono uppercase tracking-widest text-[10px]">Response will appear here</p>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-[#111] bg-[#030303] rounded-xl">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-bounce" />
                </div>
                <p className="mt-4 text-[10px] font-mono uppercase tracking-widest text-[#444]">Waiting for response...</p>
            </div>
        );
    }

    return (
        <div className="border border-[#111] bg-[#030303] rounded-xl overflow-hidden flex flex-col h-[400px]">
            {/* Response Header */}
            <div className="px-4 py-3 bg-[#0a0a0a] border-b border-[#111] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <StatusBadge status={statusCode} />
                    {status === 'streaming' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#e8ff47] animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47]" />
                            STREAMING...
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-md hover:bg-white/5 text-[#444] hover:text-[#999] transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-white/5 text-[#444] hover:text-[#999] transition-colors">
                        <Download className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex px-4 border-b border-[#111] bg-[#050505]">
                <button
                    onClick={() => setActiveTab('body')}
                    className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'body' ? 'border-[#e8ff47] text-[#f0f0f0]' : 'border-transparent text-[#444] hover:text-[#666]'
                        }`}
                >
                    Body
                </button>
                <button
                    onClick={() => setActiveTab('headers')}
                    className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'headers' ? 'border-[#e8ff47] text-[#f0f0f0]' : 'border-transparent text-[#444] hover:text-[#666]'
                        }`}
                >
                    Headers
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-[#030303]">
                {activeTab === 'body' && (
                    <>
                        {status === 'streaming' ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-white/[0.02] border border-[#111] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono text-[#444]">{chunkCount} events received</span>
                                    </div>
                                    <div className="text-xs font-mono text-[#999] leading-relaxed whitespace-pre-wrap">
                                        {streamedText}
                                        <span className="inline-block w-1.5 h-4 bg-[#e8ff47] ml-0.5 animate-pulse vertical-middle" />
                                    </div>
                                </div>
                            </div>
                        ) : status === 'error' ? (
                            <div className="text-red-500 font-mono text-xs">
                                {JSON.stringify(data, null, 2)}
                            </div>
                        ) : (
                            <JsonViewer data={data} />
                        )}
                    </>
                )}
                {activeTab === 'headers' && (
                    <div className="space-y-1">
                        {Object.entries(headers).map(([key, value]) => (
                            <div key={key} className="flex gap-4 text-xs font-mono">
                                <span className="text-[#444] min-w-[120px]">{key}:</span>
                                <span className="text-[#999]">{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponseViewer;
