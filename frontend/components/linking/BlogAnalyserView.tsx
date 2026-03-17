import React from 'react';
import { BlogSelector } from './BlogSelector';
import { BlogHeaderCard } from './BlogHeaderCard';
import { SuggestionList } from './SuggestionList';
import { LinkHealthCard } from './LinkHealthCard';
import { ApplyLinksBar } from './ApplyLinksBar';
import { AlertCircle, Loader2 } from 'lucide-react';

interface BlogAnalyserViewProps {
    engine: any; // useLinkingEngine return type
}

export function BlogAnalyserView({ engine }: BlogAnalyserViewProps) {
    const {
        selectedBlogId,
        selectedBlog,
        allBlogs,
        isLoadingBlogs,
        suggestions,
        isAnalysing,
        lastAnalysedAt,
        isApplying,
        selectBlog,
        analyseSelectedBlog,
        updateSuggestionStatus,
        approveAll,
        applyApproved,
        removeLink,
        pendingCount,
        approvedCount
    } = engine;

    return (
        <div className="space-y-8 pb-32">
            {/* Selector Section */}
            <section className="max-w-xl mx-auto md:mx-0">
                <BlogSelector
                    blogs={allBlogs}
                    selectedId={selectedBlogId}
                    onSelect={selectBlog}
                />
            </section>

            {selectedBlog ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <BlogHeaderCard
                        blog={selectedBlog}
                        onAnalyse={(force) => analyseSelectedBlog({ forceRefresh: force })}
                        isAnalysing={isAnalysing}
                        lastAnalysedAt={lastAnalysedAt}
                    />

                    {/* suggestions logic */}
                    {(suggestions.length > 0 || isAnalysing) ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-zinc-100 italic">Recommendations</h2>
                                    <span className="bg-zinc-900 px-2 py-0.5 rounded text-[10px] font-bold text-zinc-500 border border-zinc-800 uppercase tracking-widest">
                                        {suggestions.length} items found
                                    </span>
                                </div>

                                {pendingCount > 0 && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-zinc-800 text-zinc-400 hover:text-accent hover:border-accent/40"
                                        onClick={approveAll}
                                        disabled={isAnalysing}
                                    >
                                        Approve All Pending
                                    </Button>
                                )}
                            </div>

                            {isAnalysing && suggestions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <Loader2 className="h-8 w-8 text-accent animate-spin" />
                                    <p className="text-sm text-zinc-500 font-medium">Scanning your library for connections...</p>
                                </div>
                            ) : (
                                <SuggestionList
                                    suggestions={suggestions}
                                    onApprove={(id) => updateSuggestionStatus(id, 'approved')}
                                    onReject={(id, reason) => updateSuggestionStatus(id, 'rejected', reason)}
                                    onUndoReject={(id) => updateSuggestionStatus(id, 'pending')}
                                    onRemove={removeLink}
                                    isLoading={isApplying}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center text-center space-y-4">
                            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-zinc-700" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-zinc-400 font-bold italic">No analysis performed for this blog yet</h3>
                                <p className="text-sm text-zinc-600 max-w-xs mx-auto">
                                    Click the "Analyse Links" button above to find internal linking opportunities.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Health Section */}
                    <div className="pt-8 border-t border-zinc-900">
                        <LinkHealthCard
                            outboundLinks={[]} // Need to populate from blog state if available, or fetch
                            inboundLinks={[]}
                            onRemove={removeLink}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-zinc-900 bg-zinc-950/20">
                    <p className="text-zinc-600 font-medium italic">Select a blog from the dropdown to begin analysis.</p>
                </div>
            )}

            {/* Sticky Apply Bar */}
            <ApplyLinksBar
                approvedCount={approvedCount}
                onApply={applyApproved}
                onCancel={() => { }} // Could clear approvals or ignore
                isApplying={isApplying}
            />
        </div>
    );
}

// Dummy Button for simplicity
const Button = ({ children, variant, size, className, onClick, disabled }: any) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variant === 'outline' ? 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground shadow hover:bg-primary/90'} ${size === 'sm' ? 'h-8 rounded-md px-3 text-xs' : 'h-9 px-4 py-2'} ${className}`}
    >
        {children}
    </button>
);
