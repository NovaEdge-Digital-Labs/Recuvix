import React from 'react';
import Link from 'next/link';
import { useHistory } from '@/hooks/useHistory';
import {
    History,
    ExternalLink,
    Download,
    Star,
    ChevronRight,
    Search,
    Zap,
    Mic
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/history/relativeTime';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';

interface HistoryQuickPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HistoryQuickPanel: React.FC<HistoryQuickPanelProps> = ({
    isOpen,
    onClose
}) => {
    const router = useRouter();
    const {
        index,
        searchQuery,
        setSearchQuery,
        filteredEntries,
        openBlog,
        toggleStar,
        downloadBlog,
        storageUsage
    } = useHistory();

    // Show only first 10 for quick access unless searching
    const displayEntries = searchQuery ? filteredEntries : filteredEntries.slice(0, 10);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="bg-background border-slate-800 text-white w-full sm:max-w-md p-0 overflow-hidden flex flex-col">
                <SheetHeader className="p-6 border-b border-slate-900 bg-background/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-2">
                        <SheetTitle className="text-white flex items-center gap-2">
                            <History className="text-accent" size={20} /> Blog History
                        </SheetTitle>
                        <Link
                            href="/history"
                            onClick={onClose}
                            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                        >
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>
                    <SheetDescription className="text-muted-foreground text-xs">
                        Quickly access your recently generated blogs.
                    </SheetDescription>

                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search history..."
                            className="w-full bg-card border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {displayEntries.length > 0 ? (
                        <div className="space-y-3">
                            {displayEntries.map(entry => (
                                <div
                                    key={entry.id}
                                    className="group bg-card/50 border border-slate-800/50 rounded-xl p-3 hover:bg-card hover:border-slate-700 transition-all"
                                >
                                    <div className="flex gap-3">
                                        {/* Tiny Thumbnail */}
                                        <div className="w-16 h-9 rounded-md bg-slate-800 shrink-0 overflow-hidden border border-slate-700/50">
                                            {entry.thumbnailUrl ? (
                                                <img src={entry.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                                    <Zap size={10} className="text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-[13px] font-bold text-slate-100 truncate group-hover:text-accent transition-colors">
                                                {entry.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                                {entry.source === 'voice' && (
                                                    <>
                                                        <Mic className="text-accent h-2.5 w-2.5" />
                                                        <span>·</span>
                                                    </>
                                                )}
                                                <span>{entry.country}</span>
                                                <span>·</span>
                                                <span>{entry.wordCount}w</span>
                                                <span>·</span>
                                                <span>{formatRelativeTime(entry.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/50">
                                        <button
                                            onClick={() => toggleStar(entry.id)}
                                            className={`transition-colors ${entry.isStarred ? 'text-accent' : 'text-slate-600 hover:text-muted-foreground/80'}`}
                                        >
                                            <Star size={14} fill={entry.isStarred ? "currentColor" : "none"} />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => downloadBlog(entry.id, 'zip')}
                                                className="p-1.5 text-muted-foreground hover:text-white hover:bg-slate-800 rounded-md transition-all"
                                                title="Download ZIP"
                                            >
                                                <Download size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    openBlog(entry.id);
                                                    onClose();
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-black text-[11px] font-bold rounded-lg hover:scale-105 transition-all"
                                            >
                                                <ExternalLink size={12} strokeWidth={3} /> Open
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!searchQuery && index.length > 10 && (
                                <button
                                    onClick={() => router.push('/history')}
                                    className="w-full py-4 text-xs font-bold text-muted-foreground hover:text-accent transition-colors"
                                >
                                    View All {index.length} Blogs →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <History size={48} className="text-slate-800 mb-4" />
                            <p className="text-muted-foreground text-sm">
                                {searchQuery ? 'No results found' : 'Your history is empty'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-900 bg-background/80 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                        <span>{storageUsage.totalBlogs} / 50 blogs saved</span>
                        <span className="text-accent/70 font-bold">{storageUsage.availableSlots} slots left</span>
                    </div>
                    <div className="h-1 w-full bg-card rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{ width: `${(storageUsage.totalBlogs / 50) * 100}%` }}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
