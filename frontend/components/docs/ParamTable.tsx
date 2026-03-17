import React from 'react';

interface Param {
    name: string;
    type: string;
    required?: boolean;
    description: string;
    default?: string | number | boolean;
}

interface ParamTableProps {
    params: Param[];
}

const ParamTable: React.FC<ParamTableProps> = ({ params }) => {
    return (
        <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-[#1a1a1a] bg-[#0d0d0d]">
                        <th className="text-left py-3 px-4 font-mono text-[11px] text-[#666] uppercase tracking-wider">Parameter</th>
                        <th className="text-left py-3 px-4 font-mono text-[11px] text-[#666] uppercase tracking-wider">Type</th>
                        <th className="text-left py-3 px-4 font-mono text-[11px] text-[#666] uppercase tracking-wider">Required</th>
                        <th className="text-left py-3 px-4 font-mono text-[11px] text-[#666] uppercase tracking-wider">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {params.map((param) => (
                        <tr key={param.name} className="border-b border-[#0d0d0d] hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 font-mono text-[#e8ff47]">{param.name}</td>
                            <td className="py-4 px-4">
                                <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[11px] font-mono text-[#999]">
                                    {param.type}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                {param.required ? (
                                    <span className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">Required</span>
                                ) : (
                                    <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">Optional</span>
                                )}
                            </td>
                            <td className="py-4 px-4 text-[#999] leading-relaxed">
                                {param.description}
                                {param.default && (
                                    <div className="mt-1 text-[11px] text-[#666]">
                                        Default: <code className="text-[#888]">{param.default}</code>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ParamTable;
