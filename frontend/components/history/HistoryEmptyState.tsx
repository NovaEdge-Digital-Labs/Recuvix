import React from 'react';
import { Search, Plus, RotateCcw } from 'lucide-react';

interface HistoryEmptyStateProps {
    type: 'no-blogs' | 'no-results';
    onAction?: () => void;
}

export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({ type, onAction }) => {
    if (type === 'no-results') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
                    <div className="relative w-20 h-20 bg-card border border-slate-800 rounded-3xl flex items-center justify-center text-accent/40">
                        <Search size={40} strokeWidth={1.5} />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900">
                            X
                        </div>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No blogs match your search</h3>
                <p className="text-muted-foreground/80 text-sm max-w-xs mx-auto mb-8">
                    Try a different search term or clear your active filters.
                </p>
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-all"
                >
                    <RotateCcw size={16} /> Clear Filters
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />

                {/* SVG Illustration - Overlapping documents with sparkle */}
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Document 3 (Back) */}
                    <rect x="45" y="30" width="45" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" transform="rotate(-10 67.5 60)" />
                    {/* Document 2 (Middle) */}
                    <rect x="40" y="25" width="45" height="60" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="2" transform="rotate(-5 62.5 55)" />
                    {/* Document 1 (Front) */}
                    <rect x="35" y="20" width="45" height="60" rx="4" fill="#020617" stroke="#94a3b8" strokeWidth="2" />

                    {/* Decoration Lines */}
                    <line x1="42" y1="35" x2="73" y2="35" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    <line x1="42" y1="45" x2="65" y2="45" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    <line x1="42" y1="55" x2="70" y2="55" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

                    {/* Sparkle Star */}
                    <path d="M95 15L97.5 22.5L105 25L97.5 27.5L95 35L92.5 27.5L85 25L92.5 22.5L95 15Z" fill="#e8ff47" className="animate-pulse" />
                    <circle cx="105" cy="45" r="3" fill="#e8ff47" fillOpacity="0.4" />
                    <circle cx="85" cy="55" r="2" fill="#e8ff47" fillOpacity="0.2" />
                </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-3">Your library is empty</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                Every blog you generate will be automatically saved here.
                Start creating content to build your history.
            </p>

            <button
                onClick={onAction}
                className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-[#d4ed3d] text-black text-sm font-bold rounded-xl transition-all shadow-[0_10px_20px_rgba(232,255,71,0.2)] hover:scale-105 active:scale-95"
            >
                <Plus size={18} strokeWidth={2.5} /> Generate Your First Blog
            </button>
        </div>
    );
};
