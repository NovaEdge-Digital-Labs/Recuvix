import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';
import { Plus, HelpCircle, Target, Zap, AlertCircle } from 'lucide-react';

interface GapAnalysisTabsProps {
    analysis: {
        contentWeaknesses: string[];
        missingKeywords: string[];
        questionsMissed: string[];
        uniqueValueGaps: string[];
    };
    onAddKeyword?: (kw: string) => void;
    onAddQuestion?: (q: string) => void;
}

const GapItem = ({ text, type, actionLabel, onAction }: { text: string; type: string; actionLabel?: string; onAction?: () => void }) => (
    <div className="group flex items-start justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 transition-all">
        <div className="flex items-start space-x-3">
            <div className={`mt-1 p-1 rounded-md ${type === 'weakness' ? 'bg-red-500/10 text-red-400' :
                type === 'keyword' ? 'bg-blue-500/10 text-blue-400' :
                    type === 'question' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-green-500/10 text-green-400'
                }`}>
                {type === 'weakness' && <AlertCircle className="w-3.5 h-3.5" />}
                {type === 'keyword' && <Target className="w-3.5 h-3.5" />}
                {type === 'question' && <HelpCircle className="w-3.5 h-3.5" />}
                {type === 'opportunity' && <Zap className="w-3.5 h-3.5" />}
            </div>
            <div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">{text}</p>
                <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        {type}
                    </span>
                </div>
            </div>
        </div>
        {onAction && (
            <Button
                variant="ghost"
                size="sm"
                onClick={onAction}
                className="opacity-0 group-hover:opacity-100 text-xs text-[#e8ff47] hover:text-[#e8ff47] hover:bg-[#e8ff47]/10"
            >
                <Plus className="w-3 h-3 mr-1" />
                {actionLabel}
            </Button>
        )}
    </div>
);

export const GapAnalysisTabs = ({ analysis, onAddKeyword, onAddQuestion }: GapAnalysisTabsProps) => {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <Tabs.Root defaultValue="weaknesses" className="w-full">
                <Tabs.List className="flex border-b border-slate-800 bg-slate-900/80">
                    <Tabs.Trigger
                        value="weaknesses"
                        className="flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest text-slate-400 border-b-2 border-transparent data-[state=active]:text-[#e8ff47] data-[state=active]:border-[#e8ff47] transition-all"
                    >
                        Weaknesses
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="keywords"
                        className="flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest text-slate-400 border-b-2 border-transparent data-[state=active]:text-[#e8ff47] data-[state=active]:border-[#e8ff47] transition-all"
                    >
                        Keywords
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="questions"
                        className="flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest text-slate-400 border-b-2 border-transparent data-[state=active]:text-[#e8ff47] data-[state=active]:border-[#e8ff47] transition-all"
                    >
                        Questions
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="opportunities"
                        className="flex-1 px-4 py-3 text-xs font-mono uppercase tracking-widest text-slate-400 border-b-2 border-transparent data-[state=active]:text-[#e8ff47] data-[state=active]:border-[#e8ff47] transition-all"
                    >
                        Opportunities
                    </Tabs.Trigger>
                </Tabs.List>

                <div className="max-h-[460px] overflow-y-auto p-4 custom-scrollbar">
                    <Tabs.Content value="weaknesses" className="space-y-3">
                        {analysis.contentWeaknesses.map((w, i) => (
                            <GapItem key={i} text={w} type="weakness" />
                        ))}
                    </Tabs.Content>
                    <Tabs.Content value="keywords" className="space-y-3">
                        {analysis.missingKeywords.map((k, i) => (
                            <GapItem
                                key={i}
                                text={k}
                                type="keyword"
                                actionLabel="Include"
                                onAction={() => onAddKeyword?.(k)}
                            />
                        ))}
                    </Tabs.Content>
                    <Tabs.Content value="questions" className="space-y-3">
                        {analysis.questionsMissed.map((q, i) => (
                            <GapItem
                                key={i}
                                text={q}
                                type="question"
                                actionLabel="Add to FAQ"
                                onAction={() => onAddQuestion?.(q)}
                            />
                        ))}
                    </Tabs.Content>
                    <Tabs.Content value="opportunities" className="space-y-3">
                        {analysis.uniqueValueGaps.map((o, i) => (
                            <GapItem key={i} text={o} type="opportunity" />
                        ))}
                    </Tabs.Content>
                </div>
            </Tabs.Root>
        </div>
    );
};
