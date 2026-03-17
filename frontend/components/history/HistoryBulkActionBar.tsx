import React from 'react';
import {
    X,
    Download,
    Trash2,
    Star,
    CheckSquare
} from 'lucide-react';

interface HistoryBulkActionBarProps {
    selectedCount: number;
    onClear: () => void;
    onStarAll: () => void;
    onDownloadAll: () => void;
    onDeleteAll: () => void;
}

export const HistoryBulkActionBar: React.FC<HistoryBulkActionBarProps> = ({
    selectedCount,
    onClear,
    onStarAll,
    onDownloadAll,
    onDeleteAll
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-300">
            <div className="bg-card border border-accent/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-2xl p-2 flex items-center gap-2 backdrop-blur-xl">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-xl mr-2">
                    <CheckSquare size={18} className="text-accent" />
                    <span className="text-sm font-bold text-white">
                        {selectedCount} <span className="text-muted-foreground/80 font-normal">selected</span>
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={onStarAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <Star size={16} className="text-accent" /> Star All
                    </button>

                    <button
                        onClick={onDownloadAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 rounded-xl transition-all"
                    >
                        <Download size={16} /> Download ZIP
                    </button>

                    <div className="w-px h-6 bg-slate-800 mx-1" />

                    <button
                        onClick={onDeleteAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>

                <button
                    onClick={onClear}
                    className="ml-2 p-2 text-muted-foreground hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                    title="Cancel selection"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};
