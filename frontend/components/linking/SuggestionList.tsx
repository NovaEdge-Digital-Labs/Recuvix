import React, { useState } from 'react';
import { SuggestionCard } from './SuggestionCard';
import { LinkSuggestion } from '@/lib/linking/linkingEngine';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SuggestionListProps {
    suggestions: LinkSuggestion[];
    onApprove: (id: string) => void;
    onReject: (id: string, reason?: string) => void;
    onUndoReject: (id: string) => void;
    onRemove: (id: string) => void;
    isLoading?: boolean;
}

export function SuggestionList({
    suggestions,
    onApprove,
    onReject,
    onUndoReject,
    onRemove,
    isLoading
}: SuggestionListProps) {
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');

    const filteredSuggestions = suggestions.filter(s => {
        const matchesFilter = filter === 'all' || s.status === filter;
        const matchesSearch = s.targetTitle.toLowerCase().includes(search.toLowerCase()) ||
            s.anchorText.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const sortedSuggestions = [...filteredSuggestions].sort((a, b) => b.relevanceScore - a.relevanceScore);

    return (
        <div className="space-y-4">
            {/* List Header & Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-auto">
                    <TabsList className="bg-zinc-900 border-zinc-800">
                        <TabsTrigger value="all" className="text-xs px-3 data-[state=active]:bg-zinc-800">
                            All ({suggestions.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="text-xs px-3 data-[state=active]:bg-zinc-800">
                            Pending ({suggestions.filter(s => s.status === 'pending').length})
                        </TabsTrigger>
                        <TabsTrigger value="approved" className="text-xs px-3 data-[state=active]:bg-zinc-800">
                            Approved ({suggestions.filter(s => s.status === 'approved').length})
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search suggestions..."
                        className="pl-9 bg-zinc-950 border-zinc-800 text-sm h-9 focus:ring-accent/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid of Cards */}
            {sortedSuggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedSuggestions.map((suggestion) => (
                        <SuggestionCard
                            key={suggestion.id}
                            suggestion={suggestion}
                            onApprove={onApprove}
                            onReject={onReject}
                            onUndoReject={onUndoReject}
                            onRemove={onRemove}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
                    <div className="bg-zinc-900 p-3 rounded-full mb-3">
                        <SlidersHorizontal className="h-6 w-6 opacity-40" />
                    </div>
                    <p className="text-sm">No suggestions found match your filters.</p>
                </div>
            )}
        </div>
    );
}
