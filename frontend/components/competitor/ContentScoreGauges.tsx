import React from 'react';
import { getScoreColor } from '@/lib/competitor/scoreColorMapper';

interface GaugeProps {
    score: number;
    label: string;
    type: 'competitor' | 'opportunity';
}

const Gauge = ({ score, label, type }: GaugeProps) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score, type);

    return (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-800"
                    />
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold font-syne text-white">{score}</span>
                </div>
            </div>
            <span className="text-sm font-medium text-slate-400 text-center">{label}</span>
        </div>
    );
};

interface ContentScoreGaugesProps {
    competitorScore: number;
    opportunityScore: number;
    reason?: string;
}

export const ContentScoreGauges = ({ competitorScore, opportunityScore, reason }: ContentScoreGaugesProps) => {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-6">Content Scores</h3>
            <div className="flex justify-around items-center gap-8">
                <Gauge score={competitorScore} label="Their Content Score" type="competitor" />
                <Gauge score={opportunityScore} label="Your Opportunity" type="opportunity" />
            </div>
            {reason && (
                <p className="mt-6 text-sm text-slate-400 italic text-center max-w-sm mx-auto leading-relaxed">
                    &ldquo;{reason}&rdquo;
                </p>
            )}
        </div>
    );
};
