import React from 'react';
import { Search, X } from 'lucide-react';

interface HistorySearchBarProps {
    value: string;
    onChange: (val: string) => void;
    resultCount?: number;
}

export const HistorySearchBar: React.FC<HistorySearchBarProps> = ({
    value,
    onChange,
    resultCount
}) => {
    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-accent transition-colors">
                <Search size={18} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by title, topic, keyword or tags..."
                className="w-full bg-card border border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
            )}

            {value && resultCount !== undefined && (
                <div className="absolute -bottom-6 left-0 text-[10px] font-bold text-accent uppercase tracking-widest pl-1">
                    {resultCount} results found
                </div>
            )}
        </div>
    );
};
