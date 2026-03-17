import React, { useState } from 'react';
import { CalendarEntry, CalendarEntryPriority } from '@/lib/calendar/calendarService';
import { EntryChip } from './EntryChip';
import { QuickAddForm } from './QuickAddForm';
import { cn } from '@/lib/utils';
import { isToday, isPast, formatDateKey } from '@/lib/calendar/dateHelpers';
import { Plus } from 'lucide-react';

interface MonthDayCellProps {
    date: Date;
    entries: CalendarEntry[];
    isCurrentMonth: boolean;
    onEntryClick: (entry: CalendarEntry) => void;
    onAddEntry: (date: string, topic: string, priority: CalendarEntryPriority) => void;
    onDropEntry?: (id: string, date: string) => void;
}

export function MonthDayCell({
    date,
    entries,
    isCurrentMonth,
    onEntryClick,
    onAddEntry,
    onDropEntry,
}: MonthDayCellProps) {
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const dateKey = formatDateKey(date);
    const today = isToday(date);
    const past = isPast(date);

    const displayEntries = entries.slice(0, 3);
    const remainingCount = entries.length - 3;

    return (
        <div
            className={cn(
                "relative min-h-[120px] p-2 border-r border-b border-white/5 transition-colors",
                !isCurrentMonth && "bg-black/40 opacity-40",
                isCurrentMonth && "bg-zinc-950",
                today && "bg-accent/5",
                isHovered && isCurrentMonth && "bg-zinc-900/50"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => isCurrentMonth && !isQuickAddOpen && setIsQuickAddOpen(true)}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={cn(
                    "text-xs font-medium flex items-center justify-center w-6 h-6 rounded-full",
                    today ? "bg-accent text-white" : "text-zinc-500"
                )}>
                    {date.getDate()}
                </span>

                {isHovered && isCurrentMonth && !isQuickAddOpen && (
                    <div className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                        <Plus className="h-3 w-3" />
                    </div>
                )}
            </div>

            <div className="space-y-1">
                {displayEntries.map((entry) => (
                    <EntryChip
                        key={entry.id}
                        entry={entry}
                        onClick={onEntryClick}
                    />
                ))}
                {remainingCount > 0 && (
                    <div className="text-[10px] text-zinc-500 font-medium pl-1">
                        + {remainingCount} more
                    </div>
                )}
            </div>

            {isQuickAddOpen && (
                <div className="absolute inset-x-1 top-8 z-20">
                    <QuickAddForm
                        onAdd={(topic, priority) => {
                            onAddEntry(dateKey, topic, priority);
                            setIsQuickAddOpen(false);
                        }}
                        onCancel={() => setIsQuickAddOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}
