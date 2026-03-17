import React from 'react';
import { Target } from 'lucide-react';

interface WinStrategyProps {
    strategy: string;
}

export const WinStrategy = ({ strategy }: WinStrategyProps) => {
    return (
        <div className="relative overflow-hidden bg-slate-900 border-l-4 border-[#e8ff47] rounded-r-xl p-6 mb-6 shadow-lg">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Target className="w-24 h-24 text-[#e8ff47]" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                    <div className="text-[10px] font-mono text-[#e8ff47] uppercase tracking-widest bg-[#e8ff47]/10 px-2 py-0.5 rounded">
                        Strategy
                    </div>
                </div>

                <p className="text-[15px] leading-relaxed text-slate-300 font-medium">
                    {strategy}
                </p>
            </div>
        </div>
    );
};
