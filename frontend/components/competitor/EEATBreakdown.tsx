import React from 'react';
import { getScoreColor } from '@/lib/competitor/scoreColorMapper';

interface EEATScore {
    experience: number;
    expertise: number;
    authoritativeness: number;
    trustworthiness: number;
    total: number;
}

interface EEATBreakdownProps {
    score: EEATScore;
}

const EEATBar = ({ label, value, max = 25 }: { label: string; value: number; max?: number }) => {
    const percentage = (value / max) * 100;

    return (
        <div className="flex items-center space-x-4">
            <div className="w-32 text-xs font-medium text-slate-400 capitalize">{label}</div>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#e8ff47] rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="w-12 text-xs font-mono text-slate-400 text-right">
                {value}/{max}
            </div>
        </div>
    );
};

export const EEATBreakdown = ({ score }: EEATBreakdownProps) => {
    const totalColor = getScoreColor(score.total, 'eeat');

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-6">E-E-A-T Breakdown</h3>
            <div className="space-y-4">
                <EEATBar label="Experience" value={score.experience} />
                <EEATBar label="Expertise" value={score.expertise} />
                <EEATBar label="Authority" value={score.authoritativeness} />
                <EEATBar label="Trust" value={score.trustworthiness} />
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">Total EEAT Signal</span>
                <span className="text-lg font-bold font-syne" style={{ color: totalColor }}>
                    {score.total}/100
                </span>
            </div>
        </div>
    );
};
