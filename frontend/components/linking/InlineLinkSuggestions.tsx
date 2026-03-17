import React, { useEffect } from 'react';
import { useLinkingEngine } from '@/hooks/useLinkingEngine';
import { SuggestionList } from './SuggestionList';
import { ApplyLinksBar } from './ApplyLinksBar';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InlineLinkSuggestionsProps {
    blogId: string;
}

export function InlineLinkSuggestions({ blogId }: InlineLinkSuggestionsProps) {
    const engine = useLinkingEngine();

    useEffect(() => {
        if (blogId) {
            engine.selectBlog(blogId);
        }
    }, [blogId]);

    const {
        suggestions,
        isAnalysing,
        isApplying,
        analyseSelectedBlog,
        updateSuggestionStatus,
        approveAll,
        applyApproved,
        removeLink,
        pendingCount,
        approvedCount
    } = engine;

    if (isAnalysing && suggestions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 text-accent animate-spin" />
                <p className="text-sm text-zinc-500 font-medium italic">Scanning library for relevant connections...</p>
            </div>
        );
    }

    if (suggestions.length === 0 && !isAnalysing) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="bg-accent/5 p-6 rounded-full">
                    <Zap className="h-10 w-10 text-accent opacity-20" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-zinc-100 italic">No Analysis Yet</h3>
                    <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
                        Find internal link opportunities to boost this blog's SEO authority.
                    </p>
                </div>
                <Button
                    className="bg-accent text-zinc-950 hover:bg-accent/90 font-bold px-8 shadow-lg shadow-accent/5 transition-all hover:scale-105"
                    onClick={() => analyseSelectedBlog()}
                >
                    Find Link Opportunities
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-zinc-100 italic">Link Suggestions</h3>
                    <span className="bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                        {suggestions.length} Found
                    </span>
                </div>

                {pendingCount > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-800 text-zinc-400 hover:text-accent hover:border-accent/30 text-xs h-8"
                        onClick={approveAll}
                    >
                        Approve All
                    </Button>
                )}
            </div>

            <SuggestionList
                suggestions={suggestions}
                onApprove={(id) => updateSuggestionStatus(id, 'approved')}
                onReject={(id) => updateSuggestionStatus(id, 'rejected')}
                onUndoReject={(id) => updateSuggestionStatus(id, 'pending')}
                onRemove={removeLink}
                isLoading={isApplying}
            />

            <ApplyLinksBar
                approvedCount={approvedCount}
                onApply={applyApproved}
                onCancel={() => { }}
                isApplying={isApplying}
            />
        </div>
    );
}
