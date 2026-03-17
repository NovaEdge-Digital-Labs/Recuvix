import React from 'react';

interface ApiEndpointProps {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    description?: string;
}

const ApiEndpoint: React.FC<ApiEndpointProps> = ({ method, path, description }) => {
    const methodColors = {
        GET: 'bg-green-500 text-black',
        POST: 'bg-blue-500 text-white',
        PATCH: 'bg-[#e8ff47] text-black',
        DELETE: 'bg-red-500 text-white',
    };

    return (
        <div className="my-8 p-4 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a]">
            <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${methodColors[method]}`}>
                    {method}
                </span>
                <code className="text-sm font-mono text-[#e8ff47]">{path}</code>
            </div>
            {description && (
                <p className="mt-3 text-sm text-[#999] leading-relaxed">
                    {description}
                </p>
            )}
        </div>
    );
};

export default ApiEndpoint;
