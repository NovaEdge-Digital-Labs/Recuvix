import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkSuggestion, SuggestionStatus } from '@/lib/linking/linkingEngine';
import { SuggestionScoreBadge } from './SuggestionScoreBadge';
import { ScoreBreakdownBar } from './ScoreBreakdownBar';
import { ContextHighlight } from './ContextHighlight';
import { Check, X, ExternalLink, RotateCcw, Link2Off } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SuggestionCardProps {
    suggestion: LinkSuggestion;
    onApprove: (id: string) => void;
    onReject: (id: string, reason?: string) => void;
    onUndoReject: (id: string) => void;
    onRemove: (id: string) => void;
    isLoading?: boolean;
}

export function SuggestionCard({
    suggestion,
    onApprove,
    onReject,
    onUndoReject,
    onRemove,
    isLoading
}: SuggestionCardProps) {
    const isPending = suggestion.status === 'pending';
    const isApproved = suggestion.status === 'approved';
    const isRejected = suggestion.status === 'rejected';
    const isApplied = suggestion.status === 'applied';

    return (
        <Card className={cn(
            "relative overflow-hidden border-zinc-800 bg-zinc-950 p-4 transition-all hover:bg-zinc-900/50",
            isApproved && "border-accent/40 shadow-[0_0_15px_-5px_var(--accent)]",
            isRejected && "opacity-50",
            isApplied && "border-green-500/40"
        )}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <SuggestionScoreBadge score={suggestion.relevanceScore} />
                        <span className="text-sm font-medium text-zinc-200 line-clamp-1">
                            {suggestion.targetTitle}
                        </span>
                    </div>

                    {/* Anchor & Context */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                            <span className="text-zinc-400">Anchor:</span>
                            <span className="text-zinc-200">"{suggestion.anchorText}"</span>
                        </div>

                        <ContextHighlight
                            sentence={suggestion.contextSentence}
                            anchor={suggestion.anchorText}
                            className="text-xs"
                        />
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <span>Type:</span>
                            <span className="capitalize text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                {suggestion.placementType.replace('_', ' ')}
                            </span>
                        </div>
                        {suggestion.sectionH2 && (
                            <div className="flex items-center gap-1.5">
                                <span>Section:</span>
                                <span className="text-zinc-400 truncate max-w-[150px]">H2 — {suggestion.sectionH2}</span>
                            </div>
                        )}
                        <ScoreBreakdownBar breakdown={suggestion.scoreBreakdown} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                    {isPending && (
                        <>
                            <Button
                                size="sm"
                                className="h-8 w-8 rounded-full bg-accent text-zinc-950 hover:bg-accent/90"
                                onClick={() => onApprove(suggestion.id)}
                                disabled={isLoading}
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 rounded-full border-zinc-800 text-zinc-400 hover:text-zinc-200"
                                onClick={() => onReject(suggestion.id)}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    )}

                    {isApproved && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 rounded-full border-zinc-700 text-zinc-400 hover:text-zinc-200"
                            onClick={() => onUndoReject(suggestion.id)} // Shared logic for undoing approved back to pending? 
                            // Requirements say "Undo Reject", let's keep it simple.
                            disabled={isLoading}
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    {isRejected && (
                        <Button
                            size="sm"
                            variant="link"
                            className="p-0 h-auto text-[10px] text-zinc-500 hover:text-accent"
                            onClick={() => onUndoReject(suggestion.id)}
                            disabled={isLoading}
                        >
                            Undo
                        </Button>
                    )}

                    {isApplied && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 rounded-full border-green-500/20 text-green-500/60 hover:text-red-400 hover:border-red-400/20"
                            onClick={() => onRemove(suggestion.id)}
                            disabled={isLoading}
                        >
                            <Link2Off className="h-3.5 w-3.5" />
                        </Button>
                    )}

                    <a
                        href={suggestion.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-8 w-8 rounded-full border border-zinc-800 text-zinc-500 hover:text-accent hover:border-accent/40 transition-colors"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>

            {isApplied && (
                <div className="absolute top-0 right-0 p-1">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] h-4">
                        Applied
                    </Badge>
                </div>
            )}
        </Card>
    );
}
