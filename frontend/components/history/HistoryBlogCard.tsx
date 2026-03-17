import React, { useMemo } from 'react';
import { HistoryIndexEntry } from '@/lib/history/historySearch';
import { formatRelativeTime } from '@/lib/history/relativeTime';
import { getOptimizedImageUrl } from '@/lib/utils/cloudinary';

import {
    Star,
    ExternalLink,
    Download,
    MoreVertical,
    Trash2,
    Tag as TagIcon,
    RefreshCw,
    Globe,
    CheckCircle2,
    Square,
    Zap,
    Share2,
    Network,
    Calendar
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { VoiceRecordingBadge } from '@/components/voice/VoiceRecordingBadge';

interface HistoryBlogCardProps {
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
    showExcerpt?: boolean;
}

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const HistoryBlogCard: React.FC<HistoryBlogCardProps> = ({
    entry,
    isSelected,
    onSelect,
    onOpen,
    onDownload,
    onToggleStar,
    onDelete,
    onRegenerate,
    onEditTags,
    showExcerpt = true
}) => {
    // router is used for navigation but we dispatch openBlog instead
    const _router = useRouter();
    void _router; // suppress unused warning

    // Deterministic gradient from topic
    const gradientStyle = useMemo(() => {
        if (entry.thumbnailUrl) return {};

        const hash = entry.topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        const color1 = `hsl(${hue}, 60%, 20%)`;
        const color2 = `hsl(${(hue + 40) % 360}, 60%, 15%)`;
        return {
            background: `linear-gradient(135deg, ${color1}, ${color2})`
        };
    }, [entry.topic, entry.thumbnailUrl]);

    return (
        <div className={`
      group relative flex flex-col bg-card border rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1
      ${isSelected
                ? 'border-accent ring-1 ring-accent/40 shadow-[0_0_20px_rgba(232,255,71,0.1)]'
                : 'border-slate-800 hover:border-slate-700'}
    `}>
            {/* Selection Checkbox (Visible on hover or if selected) */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect?.(entry.id);
                }}
                className={`
          absolute top-3 left-3 z-10 cursor-pointer transition-opacity duration-200
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
            >
                {isSelected ? (
                    <div className="bg-accent text-black rounded p-0.5">
                        <CheckCircle2 size={16} strokeWidth={3} />
                    </div>
                ) : (
                    <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded p-0.5 text-white/70 hover:text-white">
                        <Square size={16} />
                    </div>
                )}
            </div>

            {/* Top Section - Thumbnail/Gradient */}
            <div
                className="h-[120px] w-full relative shrink-0"
                style={gradientStyle}
            >
                {entry.thumbnailUrl && (
                    <img
                        src={getOptimizedImageUrl(entry.thumbnailUrl, 800)}
                        alt={entry.title}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Star Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleStar(entry.id);
                    }}
                    className={`
            absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-all
            ${entry.isStarred
                            ? 'bg-accent text-black scale-110 shadow-lg'
                            : 'bg-black/40 text-white/60 hover:text-white hover:bg-black/60'}
          `}
                >
                    <Star size={14} fill={entry.isStarred ? "currentColor" : "none"} />
                </button>

                {/* Model Badge */}
                <div className="absolute bottom-2 left-3 flex gap-2">
                    <Badge className="bg-black/40 backdrop-blur-md border-white/10 text-[10px] font-medium h-5 hover:bg-black/60">
                        {entry.model}
                    </Badge>
                    {entry.calendarEntryId && (
                        <Badge className="bg-accent/80 backdrop-blur-md border-accent/20 text-[10px] font-bold h-5 text-black hover:bg-accent flex gap-1 items-center">
                            <Calendar size={10} /> Scheduled
                        </Badge>
                    )}
                    {entry.source === 'voice' && (
                        <div className="bg-black/40 backdrop-blur-md rounded-full">
                            <VoiceRecordingBadge />
                        </div>
                    )}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <h3 className="text-sm font-bold text-slate-100 line-clamp-2 min-h-[40px] leading-tight">
                    {entry.title}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80">
                    <div className="flex items-center gap-1">
                        <Globe size={11} className="text-muted-foreground" />
                        <span>{entry.country}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">·</span>
                        <span>{entry.wordCount.toLocaleString()} words</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">·</span>
                        <span>{formatRelativeTime(entry.createdAt)}</span>
                    </div>
                </div>

                {showExcerpt && entry.excerpt && (
                    <p className="text-[12px] text-muted-foreground italic line-clamp-2 leading-relaxed">
                        &ldquo;{entry.excerpt}&rdquo;
                    </p>
                )}

                {/* Tags */}
                {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {entry.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-slate-800 text-muted-foreground/80 rounded text-[10px] uppercase tracking-wider font-semibold">
                                {tag}
                            </span>
                        ))}
                        {entry.tags.length > 2 && (
                            <span className="px-1.5 py-0.5 bg-slate-800 text-muted-foreground rounded text-[10px] font-semibold">
                                +{entry.tags.length - 2}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="mt-auto px-4 py-3 border-t border-slate-800/50 flex items-center justify-between bg-card/50">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onOpen(entry.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-800 hover:bg-accent hover:text-black rounded-lg transition-all"
                    >
                        <ExternalLink size={12} /> Open
                    </button>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <button
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-muted-foreground/80 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                                >
                                    <Download size={12} /> Export
                                </button>
                            }
                        />
                        <DropdownMenuContent className="bg-card border-slate-800 text-white">
                            <DropdownMenuItem onClick={() => onDownload(entry.id, 'html')} className="text-xs hover:bg-slate-800">
                                Download HTML (.html)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDownload(entry.id, 'md')} className="text-xs hover:bg-slate-800">
                                Download Markdown (.md)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDownload(entry.id, 'xml')} className="text-xs hover:bg-slate-800">
                                Download XML (.xml)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDownload(entry.id, 'zip')} className="text-xs hover:bg-slate-800 font-bold text-accent">
                                Download Complete ZIP
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <button className="p-1.5 text-muted-foreground hover:text-white transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        }
                    />
                    <DropdownMenuContent align="end" className="bg-card border-slate-800 text-white w-48">
                        <DropdownMenuItem onClick={() => onEditTags(entry.id)} className="text-xs hover:bg-slate-800 flex items-center gap-2">
                            <TagIcon size={14} /> Edit Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0">
                            <Link
                                href={`/repurpose?blogId=${entry.id}`}
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-xs hover:bg-slate-800 transition-colors"
                            >
                                <Zap size={14} className="text-accent" />
                                <span>Repurpose Content</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRegenerate(entry.id)} className="text-xs hover:bg-slate-800 flex items-center gap-2">
                            <RefreshCw size={14} /> Regenerate Blog
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0">
                            <Link
                                href={`/linking?blogId=${entry.id}`}
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-xs hover:bg-slate-800 transition-colors"
                            >
                                <Network size={14} className="text-accent" />
                                <span>Internal Linking</span>
                            </Link>
                        </DropdownMenuItem>
                        {entry.wordPressUrl && (
                            <DropdownMenuItem onClick={() => window.open(entry.wordPressUrl!, '_blank')} className="text-xs hover:bg-slate-800 flex items-center gap-2 text-green-400">
                                <ExternalLink size={14} /> View on WordPress
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            onClick={() => onDelete(entry.id)}
                            className="text-xs hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Delete Forever
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};
