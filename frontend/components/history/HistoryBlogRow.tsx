import React, { useMemo } from 'react';
import { HistoryIndexEntry } from '@/lib/history/historySearch';
import Image from 'next/image';
import { formatRelativeTime } from '@/lib/history/relativeTime';
import {
    Star,
    ExternalLink,
    Download,
    MoreVertical,
    Trash2,
    Tag as TagIcon,
    RefreshCw,
    Globe,
    Square,
    CheckCircle2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface HistoryBlogRowProps {
    entry: HistoryIndexEntry;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    onOpen: (id: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDownload: (id: string, format: any) => void;
    onToggleStar: (id: string) => void;
    onDelete: (id: string) => void;
    onRegenerate: (id: string) => void;
    onEditTags: (id: string) => void;
}

export const HistoryBlogRow: React.FC<HistoryBlogRowProps> = React.memo(({
    entry,
    isSelected,
    onSelect,
    onOpen,
    onDownload,
    onToggleStar,
    onDelete,
    onRegenerate,
    onEditTags
}) => {
    const gradientStyle = useMemo(() => {
        if (entry.thumbnailUrl) return {};
        const hash = entry.topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        const color1 = `hsl(${hue}, 60%, 20%)`;
        const color2 = `hsl(${(hue + 40) % 360}, 60%, 15%)`;
        return { background: `linear-gradient(135deg, ${color1}, ${color2})` };
    }, [entry.topic, entry.thumbnailUrl]);

    return (
        <div className={`
      group flex items-center gap-4 px-4 py-3 bg-card border rounded-xl transition-all
      ${isSelected
                ? 'border-accent ring-1 ring-accent/40 shadow-[0_0_15px_rgba(232,255,71,0.05)]'
                : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'}
    `}>
            {/* 1. Selection / Star */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => onSelect?.(entry.id)}
                    className={`transition-colors ${isSelected ? 'text-accent' : 'text-slate-600 group-hover:text-muted-foreground/80'}`}
                >
                    {isSelected ? <CheckCircle2 size={18} /> : <Square size={18} />}
                </button>
                <button
                    onClick={() => onToggleStar(entry.id)}
                    className={`transition-colors ${entry.isStarred ? 'text-accent' : 'text-slate-600 hover:text-muted-foreground/80'}`}
                >
                    <Star size={18} fill={entry.isStarred ? "currentColor" : "none"} />
                </button>
            </div>

            {/* 2. Thumbnail */}
            <div
                className="h-10 w-16 rounded-lg overflow-hidden shrink-0 border border-slate-700"
                style={gradientStyle}
            >
                {entry.thumbnailUrl && (
                    <Image
                        src={entry.thumbnailUrl}
                        alt={entry.title || "Blog thumbnail"}
                        fill
                        sizes="64px"
                        className="object-cover"
                    />
                )}
            </div>

            {/* 3. Title & Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-slate-100 truncate flex-1">
                        {entry.title}
                    </h3>
                    <Badge variant="outline" className="text-[9px] py-0 h-4 border-slate-700 text-muted-foreground uppercase tracking-tighter">
                        {entry.model}
                    </Badge>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Globe size={10} />
                        {entry.country}
                    </div>
                    <span>·</span>
                    <span>{entry.wordCount.toLocaleString()} words</span>
                    <span>·</span>
                    <span>{formatRelativeTime(entry.createdAt)}</span>

                    {entry.tags.length > 0 && (
                        <>
                            <span>·</span>
                            <div className="flex gap-1 overflow-hidden">
                                {entry.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-accent/60">#{tag}</span>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 4. Actions */}
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={() => onOpen(entry.id)}
                    className="p-2 text-muted-foreground/80 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                    title="Open blog"
                >
                    <ExternalLink size={16} />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <button
                                className="p-2 text-muted-foreground/80 hover:text-accent hover:bg-slate-700 rounded-lg transition-all"
                                title="Download"
                            >
                                <Download size={16} />
                            </button>
                        }
                    />
                    <DropdownMenuContent className="bg-card border-slate-800 text-white">
                        <DropdownMenuItem onClick={() => onDownload(entry.id, 'html')} className="text-xs">HTML</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload(entry.id, 'md')} className="text-xs">Markdown</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload(entry.id, 'zip')} className="text-xs font-bold text-accent">Complete ZIP</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        }
                    />
                    <DropdownMenuContent align="end" className="bg-card border-slate-800 text-white w-48">
                        <DropdownMenuItem onClick={() => onEditTags(entry.id)} className="text-xs flex items-center gap-2">
                            <TagIcon size={14} /> Edit Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRegenerate(entry.id)} className="text-xs flex items-center gap-2">
                            <RefreshCw size={14} /> Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            onClick={() => onDelete(entry.id)}
                            className="text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
});

HistoryBlogRow.displayName = 'HistoryBlogRow';
