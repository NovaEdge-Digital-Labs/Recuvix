'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface JsonViewerProps {
    data: any;
    depth?: number;
    initiallyExpanded?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, depth = 0, initiallyExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

    if (data === null) return <span className="text-[#888]">null</span>;
    if (typeof data === 'boolean') return <span className="text-[#ff9eb5]">{data.toString()}</span>;
    if (typeof data === 'number') return <span className="text-[#f8c98a]">{data}</span>;
    if (typeof data === 'string') return <span className="text-[#9dffb5]">"{data}"</span>;

    const isArray = Array.isArray(data);
    const keys = Object.keys(data);
    const isEmpty = keys.length === 0;

    if (isEmpty) return <span>{isArray ? '[]' : '{}'}</span>;

    return (
        <div className={`font-mono text-xs ${depth > 0 ? 'ml-4' : ''}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 hover:text-[#f0f0f0] transition-colors"
            >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span className="text-[#888]">{isArray ? '[' : '{'}</span>
                {!isExpanded && (
                    <span className="text-[#444] text-[10px] mx-1">
                        {isArray ? `${data.length} items` : `${keys.length} keys`}
                    </span>
                )}
                {!isExpanded && <span className="text-[#888]">{isArray ? ']' : '}'}</span>}
            </button>

            {isExpanded && (
                <div className="border-l border-[#111] py-1">
                    {keys.map((key, index) => (
                        <div key={key} className="flex py-0.5">
                            {!isArray && <span className="text-[#9ecbff] mr-1">"{key}":</span>}
                            <JsonViewer data={data[key]} depth={depth + 1} initiallyExpanded={depth < 2} />
                            {index < keys.length - 1 && <span className="text-[#444]">,</span>}
                        </div>
                    ))}
                </div>
            )}

            {isExpanded && <div className="text-[#888]">{isArray ? ']' : '}'}</div>}
        </div>
    );
};

export default JsonViewer;
