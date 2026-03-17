import React from 'react';
import { CalendarEntry } from '@/lib/calendar/calendarService';
import { WeekDayColumn } from './WeekDayColumn';
import { getWeekDays, formatDateKey } from '@/lib/calendar/dateHelpers';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface WeekViewProps {
    currentDate: Date;
    entriesByDate: Map<string, CalendarEntry[]>;
    onEntryClick: (entry: CalendarEntry) => void;
    onGenerate: (entry: CalendarEntry) => void;
    onAddEntry: (date: string) => void;
    startDayOfWeek?: number;
}

export function WeekView({
    currentDate,
    entriesByDate,
    onEntryClick,
    onGenerate,
    onAddEntry,
    startDayOfWeek = 1
}: WeekViewProps) {
    const weekDays = getWeekDays(currentDate, startDayOfWeek);

    return (
        <ScrollArea className="h-full bg-zinc-950">
            <div className="flex h-full min-w-max">
                {weekDays.map((date) => {
                    const dateKey = formatDateKey(date);
                    const entries = entriesByDate.get(dateKey) || [];

                    return (
                        <WeekDayColumn
                            key={dateKey}
                            date={date}
                            entries={entries}
                            onEntryClick={onEntryClick}
                            onGenerate={onGenerate}
                            onAddEntry={onAddEntry}
                        />
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" className="bg-white/5" />
        </ScrollArea>
    );
}
