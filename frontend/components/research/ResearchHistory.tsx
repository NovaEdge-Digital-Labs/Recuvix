import { ResearchHistory } from "@/lib/types/research";
import { formatDistanceToNow } from "date-fns";
import { History, Trash2, Search, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchHistorySidebarProps {
    history: ResearchHistory[];
    onLoad: (item: ResearchHistory) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
    className?: string;
}

export function ResearchHistorySidebar({ history, onLoad, onDelete, onClear, className }: ResearchHistorySidebarProps) {
    return (
        <div className={cn("flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                    <History size={16} className="text-accent" />
                    Recent Searches
                </h2>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                            <Search size={20} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            No history items. Try &quot;Discover Topics&quot; to save a search.
                        </p>
                    </div>
                ) : (
                    history.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-background/50 border border-border/50 rounded-lg p-3 hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer overflow-hidden"
                            onClick={() => onLoad(item)}
                        >
                            <div className="flex flex-col gap-1 pr-6">
                                <span className="text-sm font-bold truncate text-foreground group-hover:text-accent transition-colors">
                                    {item.niche}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                                        {item.country}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/60">•</span>
                                    <span className="text-[10px] text-muted-foreground/60">
                                        {formatDistanceToNow(new Date(item.researchedAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(item.id);
                                }}
                                className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-destructive/10"
                            >
                                <Trash2 size={12} />
                            </button>

                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-50 transition-opacity">
                                <ExternalLink size={10} className="text-accent" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {history.length > 0 && (
                <div className="p-4 border-t border-border bg-background/40">
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider font-medium">
                        Showing last {history.length} searches
                    </p>
                </div>
            )}
        </div>
    );
}
