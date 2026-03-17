import React from 'react';
import { CalendarEntry } from '@/lib/calendar/calendarService';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/calendar/entryStatusHelpers';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EntryChipProps {
    entry: CalendarEntry;
    onClick?: (entry: CalendarEntry) => void;
    className?: string;
    isListMode?: boolean;
}

export function EntryChip({ entry, onClick, className, isListMode }: EntryChipProps) {
    const status = STATUS_CONFIG[entry.status];
    const priority = PRIORITY_CONFIG[entry.priority];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.(entry);
                        }}
                        className={cn(
                            "group relative flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all hover:brightness-110 active:scale-[0.98]",
                            status.bgColor,
                            isListMode ? "w-full border border-white/5" : "text-[11px] h-7 w-full overflow-hidden",
                            className
                        )}
                    >
                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", priority.color)} />
                        <span className={cn(
                            "truncate font-medium",
                            status.color,
                            entry.status === 'cancelled' && "line-through opacity-50"
                        )}>
                            {entry.title}
                        </span>

                        {entry.blog_id && (
                            <div className="ml-auto flex items-center gap-1 opacity-60">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-zinc-900 border-white/10 text-zinc-200">
                    <div className="space-y-1">
                        <p className="font-semibold text-[13px]">{entry.title}</p>
                        <p className="text-[11px] opacity-70 line-clamp-2">{entry.topic}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={cn("text-[10px] uppercase font-bold px-1.5 py-0.5 rounded", status.bgColor, status.color)}>
                                {status.label}
                            </span>
                            <span className="text-[10px] opacity-50">•</span>
                            <span className="text-[10px] opacity-70">{entry.content_type || 'Blog'}</span>
                            {entry.focus_keyword && (
                                <>
                                    <span className="text-[10px] opacity-50">•</span>
                                    <span className="text-[10px] opacity-70">{entry.focus_keyword}</span>
                                </>
                            )}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
