import { SortOption } from "@/lib/research/topicSorter";
import { FilterOption } from "@/lib/research/topicFilter";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface SortFilterBarProps {
    sortBy: SortOption;
    onSortChange: (val: SortOption) => void;
    filterBy: FilterOption;
    onFilterChange: (val: FilterOption) => void;
}

export function SortFilterBar({ sortBy, onSortChange, filterBy, onFilterChange }: SortFilterBarProps) {
    const filterOptions: { label: string; value: FilterOption }[] = [
        { label: "All Types", value: "all" },
        { label: "Listicles", value: "Listicle" },
        { label: "How-To Guides", value: "How-To Guide" },
        { label: "Comparisons", value: "Comparison" },
        { label: "Case Studies", value: "Case Study" },
        { label: "Ultimate Guides", value: "Ultimate Guide" },
    ];

    const sortOptions: { label: string; value: SortOption }[] = [
        { label: "Relevance", value: "relevance" },
        { label: "Traffic Potential", value: "traffic_desc" },
        { label: "Search Volume", value: "volume_desc" },
        { label: "Difficulty (Low to High)", value: "difficulty_asc" },
        { label: "Word Count", value: "wordcount_desc" },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between py-4 border-b border-border/50 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                {filterOptions.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onFilterChange(opt.value)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border",
                            filterBy === opt.value
                                ? "bg-accent text-black border-accent"
                                : "bg-card text-muted-foreground border-border hover:border-muted-foreground/50"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <span className="text-xs text-muted-foreground hidden lg:inline">Sort by</span>
                <Select value={sortBy} onValueChange={(val) => onSortChange(val as SortOption)}>
                    <SelectTrigger className="w-full md:w-[180px] h-9 bg-card border-border">
                        <SelectValue placeholder="Sort topics" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                        {sortOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
