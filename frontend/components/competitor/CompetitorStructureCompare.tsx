import React from 'react';
import { Layers, PlusCircle } from 'lucide-react';

interface CompetitorStructureCompareProps {
    competitorH2s: string[];
    yourH2s: string[];
}

export const CompetitorStructureCompare = ({ competitorH2s, yourH2s }: CompetitorStructureCompareProps) => {
    // Simple heuristic mapping - find matching or similar headings
    // For V1, we'll just show them side by side as requested
    const maxRows = Math.max(competitorH2s.length, yourH2s.length);
    const rows = [];

    for (let i = 0; i < maxRows; i++) {
        rows.push({
            competitor: competitorH2s[i] || null,
            yours: yourH2s[i] || null,
        });
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-white">Structure Comparison</h3>
            </div>

            <div className="grid grid-cols-2 bg-slate-800/20">
                <div className="p-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 border-r border-slate-800">
                    Competitor Outline
                </div>
                <div className="p-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Your Winning Outline
                </div>
            </div>

            <div className="divide-y divide-slate-800">
                {rows.map((row, i) => (
                    <div key={i} className="grid grid-cols-2 divide-x divide-slate-800">
                        <div className={`p-4 text-xs ${!row.competitor ? 'text-slate-600 italic bg-slate-900/40' : 'text-slate-400'}`}>
                            {row.competitor ? `H2: ${row.competitor}` : '(missing)'}
                        </div>
                        <div className={`p-4 text-xs flex items-center justify-between ${!row.competitor ? 'bg-[#e8ff47]/5 text-[#e8ff47]' : 'text-slate-200'}`}>
                            <span>{row.yours ? `H2: ${row.yours}` : '(missing)'}</span>
                            {!row.competitor && row.yours && <PlusCircle className="w-3.5 h-3.5" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
