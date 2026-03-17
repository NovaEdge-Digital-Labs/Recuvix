'use client';

import React from 'react';
import CodeExample from './CodeExample';
import TryItPanel from './TryItPanel';

interface EndpointPlaygroundProps {
    method: string;
    path: string;
    isStreaming: boolean;
    examples: any;
    initialBody: string;
}

const EndpointPlayground: React.FC<EndpointPlaygroundProps> = ({
    method,
    path,
    isStreaming,
    examples,
    initialBody
}) => {
    return (
        <div className="space-y-12 h-fit">
            <section>
                <h4 className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#444]" />
                    Sample Requests
                </h4>
                <CodeExample examples={examples} />
            </section>

            <section>
                <h4 className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#e8ff47]" />
                    Interactive Playground
                </h4>
                <TryItPanel
                    method={method}
                    path={path}
                    initialBody={initialBody}
                    isStreaming={isStreaming}
                />
            </section>
        </div>
    );
};

export default EndpointPlayground;
