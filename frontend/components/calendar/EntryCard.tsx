import React from 'react';
import { CalendarEntry } from '@/lib/calendar/calendarService';
import { STATUS_CONFIG, PRIORITY_CONFIG, CONTENT_TYPE_LABELS } from '@/lib/calendar/entryStatusHelpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Edit2, Clock } from 'lucide-react';

interface EntryCardProps {
    entry: CalendarEntry;
    onClick: (entry: CalendarEntry) => void;
    onGenerate: (entry: CalendarEntry) => void;
}

export function EntryCard({ entry, onClick, onGenerate }: EntryCardProps) {
    const status = STATUS_CONFIG[entry.status];
    const priority = PRIORITY_CONFIG[entry.priority];

    return (
        <div
            className="group bg-zinc-900/50 border border-white/5 rounded-xl p-3 hover:bg-zinc-800/80 transition-all cursor-pointer space-y-3 relative overflow-hidden"
            onClick={() => onClick(entry)}
        >
            {/* Priority Indicator Stripe */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-1", priority.color)} />

            <div className="flex justify-between items-start gap-2">
                <h4 className="text-sm font-bold text-white line-clamp-2 transition-colors group-hover:text-accent">
                    {entry.title}
                </h4>
                <Badge className={cn("text-[8px] uppercase font-black tracking-tighter px-1 h-4", status.bgColor, status.color)}>
                    {status.label}
                </Badge>
            </div>

            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                {entry.topic}
            </p>

            <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                    <Badge variant="outline" className="border-white/10 bg-black/40 text-[9px] h-4">
                        {CONTENT_TYPE_LABELS[entry.content_type || 'blog']}
                    </Badge>
                </div>
                {entry.scheduled_time && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {entry.scheduled_time.slice(0, 5)}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {entry.status !== 'published' ? (
                    <Button
                        size="sm"
                        className="h-7 w-full text-[10px] bg-accent hover:bg-accent/90 text-white font-bold"
                        onClick={(e) => {
                            e.stopPropagation();
                            onGenerate(entry);
                        }}
                    >
                        <ArrowRight className="h-3 w-3 mr-1.5" />
                        Generate
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-full text-[10px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-bold"
                    >
                        Published ✓
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-zinc-500 hover:text-white shrink-0"
                >
                    <Edit2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}
