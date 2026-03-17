import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';

interface BriefOutlineSectionProps {
    section: {
        id: string;
        h2: string;
        instructions: string;
        competitorHas: boolean;
        priority: "Must" | "Should" | "Could";
    };
}

export const BriefOutlineSection = ({ section }: BriefOutlineSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Must': return 'bg-[#e8ff47] text-black';
            case 'Should': return 'bg-blue-500 text-white';
            case 'Could': return 'bg-slate-700 text-slate-300';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    return (
        <div className={`p-4 bg-slate-800/20 border ${section.competitorHas ? 'border-slate-700/50' : 'border-[#e8ff47]/30'} rounded-lg hover:bg-slate-800/40 transition-all`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <Badge className={`px-2 py-0 text-[9px] font-mono uppercase tracking-wider border-none ${getPriorityColor(section.priority)}`}>
                            {section.priority}
                        </Badge>
                        {section.competitorHas ? (
                            <span className="flex items-center text-[10px] text-slate-500 font-medium italic">
                                <Check className="w-3 h-3 mr-1" />
                                Competitor covers this
                            </span>
                        ) : (
                            <span className="flex items-center text-[10px] text-green-400 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                CONTENT GAP
                            </span>
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{section.h2}</h3>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            <div className={`mt-2 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-12 opacity-80'}`}>
                <p className="text-xs text-slate-400 leading-relaxed">
                    {section.instructions}
                </p>
            </div>

            {!isExpanded && section.instructions.length > 80 && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="text-[10px] text-[#e8ff47] mt-1 hover:underline"
                >
                    Show more
                </button>
            )}
        </div>
    );
};
