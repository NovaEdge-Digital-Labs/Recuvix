import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Pencil, Target, Hash, Zap } from 'lucide-react';

interface BriefHeaderProps {
    brief: {
        superiorTitle: string;
        focusKeyword: string;
        secondaryKeywords: string[];
        targetWordCount: number;
        estimatedRankingTime: string;
    };
    competitorWordCount: number;
    onUpdateTitle?: (newTitle: string) => void;
}

export const BriefHeader = ({ brief, competitorWordCount, onUpdateTitle }: BriefHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(brief.superiorTitle);

    const wordIncrease = Math.round((brief.targetWordCount / competitorWordCount) * 100 - 100);

    return (
        <div className="bg-slate-900 border border-[#e8ff47]/20 rounded-xl p-6 shadow-2xl shadow-[#e8ff47]/5">
            <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 px-2 bg-[#e8ff47]/10 border border-[#e8ff47]/20 rounded text-[10px] font-mono text-[#e8ff47] uppercase tracking-wider">
                    Winning Brief
                </div>
                <div className="p-1 px-2 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                    Rank in {brief.estimatedRankingTime}
                </div>
            </div>

            <div className="group relative">
                {isEditing ? (
                    <input
                        autoFocus
                        className="w-full bg-slate-800 border border-[#e8ff47] rounded-lg px-3 py-2 text-2xl font-bold font-syne text-white focus:outline-none"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={() => {
                            setIsEditing(false);
                            onUpdateTitle?.(tempTitle);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setIsEditing(false);
                                onUpdateTitle?.(tempTitle);
                            }
                        }}
                    />
                ) : (
                    <div className="flex items-start justify-between">
                        <h2 className="text-2xl font-bold font-syne text-white leading-tight pr-8">
                            {brief.superiorTitle}
                        </h2>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-1 p-2 text-slate-500 hover:text-[#e8ff47] transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#e8ff47] text-black hover:bg-[#e8ff47]/90 border-none px-3 py-1 flex items-center gap-1.5">
                        <Target className="w-3 h-3" />
                        {brief.focusKeyword}
                    </Badge>
                    {brief.secondaryKeywords.map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-slate-400 border-slate-700 font-normal px-3 py-1">
                            {kw}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                            <Hash className="w-3 h-3" />
                            <span>Target Length</span>
                        </div>
                        <div className="text-sm font-bold text-white">
                            ~{brief.targetWordCount} words
                            <span className="ml-2 text-[10px] text-green-400 font-normal">
                                (+{wordIncrease}%)
                            </span>
                        </div>
                    </div>
                    <div className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                            <Zap className="w-3 h-3" />
                            <span>Win Strategy</span>
                        </div>
                        <div className="text-sm font-bold text-[#e8ff47]">High Impact</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
