import React from 'react';
import { StorageBar } from './StorageBar';
import { TagChip } from './TagChip';
import {
    HistoryIndexEntry,
    FilterState
} from '@/lib/history/historySearch';
import {
    FileText,
    Type,
    Globe,
    Star,
    Settings,
    ShieldCheck,
    Tag as TagIcon,
    Filter as FilterIcon,
    Calendar
} from 'lucide-react';
import { Slider } from "@/components/ui/slider";

interface HistorySidebarProps {
    index: HistoryIndexEntry[];
    activeFilters: FilterState;
    onFilterChange: (updates: Partial<FilterState>) => void;
    uniqueCountries: string[];
    uniqueModels: string[];
    allTags: string[];
    totalWords: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storageUsage: any;
    onManageStorage: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    index,
    activeFilters,
    onFilterChange,
    uniqueCountries,
    allTags,
    totalWords,
    storageUsage,
    onManageStorage
}) => {
    const stats = [
        { label: 'Total Blogs', value: index.length, icon: FileText },
        { label: 'Total Words', value: totalWords.toLocaleString(), icon: Type },
        { label: 'Countries', value: uniqueCountries.length, icon: Globe },
        { label: 'Starred', value: index.filter(e => e.isStarred).length, icon: Star },
    ];

    return (
        <div className="w-[280px] shrink-0 space-y-8 pr-6 hidden lg:block border-r border-slate-800/50 min-h-[calc(100vh-12rem)]">
            {/* 1. Stats Grid */}
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Overview</h4>
                <div className="grid grid-cols-2 gap-2">
                    {stats.map(s => (
                        <div key={s.label} className="bg-card border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
                            <s.icon size={14} className="text-muted-foreground" />
                            <div className="text-lg font-bold text-white">{s.value}</div>
                            <div className="text-[10px] text-muted-foreground font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Quick Filters */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <FilterIcon size={10} /> Filters
                    </h4>
                    <button
                        onClick={() => onFilterChange({ starred: false, published: false })}
                        className="text-[10px] text-accent hover:underline"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onFilterChange({ starred: !activeFilters.starred })}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeFilters.starred ? 'bg-accent text-black shadow-lg shadow-[#e8ff47]/10' : 'bg-card text-muted-foreground/80 hover:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-2">
                            <Star size={14} fill={activeFilters.starred ? 'currentColor' : 'none'} />
                            Favorites
                        </div>
                        <span className={activeFilters.starred ? 'text-black/50' : 'text-slate-600'}>
                            {index.filter(e => e.isStarred).length}
                        </span>
                    </button>

                    <button
                        onClick={() => onFilterChange({ published: !activeFilters.published })}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeFilters.published ? 'bg-green-500 text-black shadow-lg shadow-green-500/10' : 'bg-card text-muted-foreground/80 hover:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} />
                            Published
                        </div>
                        <span className={activeFilters.published ? 'text-black/50' : 'text-slate-600'}>
                            {index.filter(e => e.hasWordPressPost).length}
                        </span>
                    </button>
                </div>
            </div>

            {/* 3. Word Count Range */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Word Count</h4>
                <div className="px-1 space-y-4">
                    <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                        <span>{activeFilters.wordCountMin}</span>
                        <span className="text-accent">{activeFilters.wordCountMax === 5000 ? 'Any' : activeFilters.wordCountMax}</span>
                    </div>
                    <Slider
                        value={[activeFilters.wordCountMin, activeFilters.wordCountMax]}
                        max={5000}
                        step={100}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onValueChange={(val: any) => {
                            const [min, max] = Array.isArray(val) ? val : [val, val];
                            onFilterChange({ wordCountMin: min, wordCountMax: max });
                        }}
                        className="text-accent"
                    />
                </div>
            </div>

            {/* 4. Tags List */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                    <TagIcon size={10} /> Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2 px-1">
                    {allTags.slice(0, 10).map(tag => (
                        <TagChip
                            key={tag}
                            label={tag}
                            active={activeFilters.tags.includes(tag)}
                            onClick={() => {
                                const newTags = activeFilters.tags.includes(tag)
                                    ? activeFilters.tags.filter(t => t !== tag)
                                    : [...activeFilters.tags, tag];
                                onFilterChange({ tags: newTags });
                            }}
                        />
                    ))}
                    {allTags.length === 0 && <span className="text-[11px] text-slate-600 italic">No tags found</span>}
                </div>
            </div>

            {/* 5. Date Filter */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                    <Calendar size={10} /> Date Range
                </h4>
                <div className="grid grid-cols-2 gap-1 px-1">
                    {['all', 'today', 'week', 'month'].map(range => (
                        <button
                            key={range}
                            onClick={() => onFilterChange({ dateRange: range as FilterState['dateRange'] })}
                            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${activeFilters.dateRange === range ? 'bg-accent text-black' : 'bg-card text-muted-foreground hover:text-slate-300'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* 6. Storage Summary */}
            <div className="pt-6 border-t border-slate-800 mt-auto">
                <StorageBar used={storageUsage.totalBlogs} />
                <button
                    onClick={onManageStorage}
                    className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/80 hover:text-white transition-colors"
                >
                    <Settings size={12} /> Manage Storage
                </button>
            </div>
        </div>
    );
};
