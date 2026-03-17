import React from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface UserSearchFiltersProps {
    filters: any;
    setFilters: (filters: any) => void;
}

export const UserSearchFilters = ({ filters, setFilters }: UserSearchFiltersProps) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value, page: 1 });
    };

    const handleFilterChange = (key: string, value: string | null) => {
        setFilters({ ...filters, [key]: value ?? '', page: 1 });
    };

    return (
        <div className="space-y-4">
            {/* Row 1: Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                    placeholder="Search by email or name..."
                    className="pl-10 bg-zinc-950 border-zinc-900 h-11 focus-visible:ring-accent"
                    value={filters.search}
                    onChange={handleSearch}
                />
            </div>

            {/* Row 2: Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Filters:</span>

                    <Select value={filters.label} onValueChange={(val) => handleFilterChange('label', val)}>
                        <SelectTrigger className="w-[140px] bg-zinc-950 border-zinc-900 h-9 text-xs">
                            <SelectValue placeholder="Label" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                            <SelectItem value="all">All Labels</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="agency">Agency</SelectItem>
                            <SelectItem value="influencer">Influencer</SelectItem>
                            <SelectItem value="flagged">Flagged</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.isSuspended} onValueChange={(val) => handleFilterChange('isSuspended', val)}>
                        <SelectTrigger className="w-[140px] bg-zinc-950 border-zinc-900 h-9 text-xs">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="false">Active</SelectItem>
                            <SelectItem value="true">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filters.mode} onValueChange={(val) => handleFilterChange('mode', val)}>
                        <SelectTrigger className="w-[140px] bg-zinc-950 border-zinc-900 h-9 text-xs">
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                            <SelectItem value="all">All Modes</SelectItem>
                            <SelectItem value="byok">BYOK</SelectItem>
                            <SelectItem value="managed">Managed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sort:</span>
                    <Select value={filters.sortBy} onValueChange={(val) => handleFilterChange('sortBy', val)}>
                        <SelectTrigger className="w-[160px] bg-zinc-950 border-zinc-900 h-9 text-xs">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                            <SelectItem value="created_at">Newest First</SelectItem>
                            <SelectItem value="blogs">Most Blogs</SelectItem>
                            <SelectItem value="credits">Most Credits</SelectItem>
                        </SelectContent>
                    </Select>

                    <button
                        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 transition-colors"
                    >
                        {filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4 text-zinc-400" /> : <SortDesc className="w-4 h-4 text-zinc-400" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
