import React from 'react';
import { Sparkles, Lightbulb, Quote, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AnalysisCardProps {
    analysis: {
        mainThesis: string;
        keyInsights: string[];
        speakerTone: string;
        strongQuotes: string[];
        suggestedFocusKeyword: string;
        suggestedTitle: string;
    };
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h3 className="text-sm uppercase tracking-widest text-white/40 font-bold">Transcript Analysis</h3>
                <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent capitalize">
                    {analysis.speakerTone} Tone
                </Badge>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-3">
                    <Target className="w-4 h-4 text-accent mt-0.5" />
                    <p className="text-xs uppercase tracking-wider text-white/40 font-bold">Core Message</p>
                </div>
                <p className="text-sm leading-relaxed">{analysis.mainThesis}</p>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <p className="text-xs uppercase tracking-wider text-white/40 font-bold">Key Insights</p>
                </div>
                <ul className="space-y-3">
                    {analysis.keyInsights.slice(0, 4).map((insight, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                            <span className="text-accent font-mono text-[10px] mt-1">0{i + 1}</span>
                            {insight}
                        </li>
                    ))}
                </ul>
            </div>

            {analysis.strongQuotes.length > 0 && (
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Quote className="w-4 h-4 text-accent" />
                        <p className="text-xs uppercase tracking-wider text-white/40 font-bold">Memorable Quotes</p>
                    </div>
                    <div className="space-y-4">
                        {analysis.strongQuotes.slice(0, 2).map((quote, i) => (
                            <blockquote key={i} className="pl-4 border-l-2 border-accent/40 italic text-sm text-white/60">
                                "{quote}"
                            </blockquote>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
