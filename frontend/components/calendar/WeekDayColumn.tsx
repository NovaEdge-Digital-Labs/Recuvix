import React from 'react';
import { CalendarEntry } from '@/lib/calendar/calendarService';
import { EntryCard } from './EntryCard';
import { isToday, isPast } from '@/lib/calendar/dateHelpers';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface WeekDayColumnProps {
    date: Date;
    entries: CalendarEntry[];
    onEntryClick: (entry: CalendarEntry) => void;
    onGenerate: (entry: CalendarEntry) => void;
    onAddEntry: (date: string) => void;
}

export function WeekDayColumn({
    date,
    entries,
    onEntryClick,
    onGenerate,
    onAddEntry
}: WeekDayColumnProps) {
    const today = isToday(date);
    const past = isPast(date);

    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();

    return (
        <div className={cn(
            "flex-1 flex flex-col min-w-[200px] border-r border-white/5",
            today && "bg-accent/[0.02]"
        )}>
            {/* Column Header */}
            <div className={cn(
                "p-4 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-950 z-10",
                today && "bg-zinc-900/50"
            )}>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex flex-col items-center justify-center w-10 h-10 rounded-xl",
                        today ? "bg-accent text-white" : "bg-zinc-900 text-zinc-400"
                    )}>
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{dayName}</span>
                        <span className="text-sm font-black">{dayNum}</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-500">
                            {entries.length} Topics
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => onAddEntry(date.toISOString().split('T')[0])}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Entry List */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {entries.map(entry => (
                    <EntryCard
                        key={entry.id}
                        entry={entry}
                        onClick={onEntryClick}
                        onGenerate={onGenerate}
                    />
                ))}

                {entries.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 pointer-events-none">
                        <Plus className="h-8 w-8 mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">Empty Day</span>
                    </div>
                )}
            </div>
        </div>
    );
}
