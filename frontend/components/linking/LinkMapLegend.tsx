import React from 'react';

export function LinkMapLegend() {
    const items = [
        { label: 'Small Dot', desc: 'No inbound links', color: 'bg-accent/40' },
        { label: 'Medium Dot', desc: 'Some inbound links', color: 'bg-accent/70' },
        { label: 'Large Dot', desc: 'Hub blog (many inbound)', color: 'bg-accent border border-accent/20' },
        { label: 'Red Border', desc: 'Orphan blog (not linked)', color: 'bg-red-500/20 border border-red-500/50' },
    ];

    return (
        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 space-y-3">
            <h4 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest border-b border-zinc-900 pb-2">
                Legend
            </h4>
            <div className="space-y-2.5">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full shrink-0 ${item.color}`} />
                        <div>
                            <p className="text-[10px] font-bold text-zinc-300 leading-none mb-0.5">{item.label}</p>
                            <p className="text-[9px] text-zinc-600 leading-none">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
