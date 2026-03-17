import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { SortOption } from '@/lib/history/historySearch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface HistorySortFilterProps {
    resultCount: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
}

export const HistorySortFilter: React.FC<HistorySortFilterProps> = ({
    resultCount,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy
}) => {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{resultCount}</span>
                <span className="text-muted-foreground text-sm">blogs found</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Sort Select */}
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Sort by:</span>
                    <Select
                        value={sortBy}
                        onValueChange={(val) => setSortBy(val as SortOption)}
                    >
                        <SelectTrigger className="w-[180px] bg-card border-slate-800 text-xs text-slate-300">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-slate-800 text-slate-300">
                            <SelectItem value="newest" className="text-xs">Newest first</SelectItem>
                            <SelectItem value="oldest" className="text-xs">Oldest first</SelectItem>
                            <SelectItem value="recently_viewed" className="text-xs">Recently viewed</SelectItem>
                            <SelectItem value="most_words" className="text-xs">Most words</SelectItem>
                            <SelectItem value="az" className="text-xs">A to Z</SelectItem>
                            <SelectItem value="za" className="text-xs">Z to A</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* View Switcher */}
                <div className="flex bg-card p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-accent' : 'text-muted-foreground hover:text-slate-300'}`}
                        title="Grid view"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-800 text-accent' : 'text-muted-foreground hover:text-slate-300'}`}
                        title="List view"
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
