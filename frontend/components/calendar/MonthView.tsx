import React from 'react';
import { CalendarEntry, CalendarEntryPriority } from '@/lib/calendar/calendarService';
import { MonthDayCell } from './MonthDayCell';
import { getCalendarGrid, formatDateKey } from '@/lib/calendar/dateHelpers';

interface MonthViewProps {
    currentDate: Date;
    entriesByDate: Map<string, CalendarEntry[]>;
    onEntryClick: (entry: CalendarEntry) => void;
    onAddEntry: (date: string, topic: string, priority: CalendarEntryPriority) => void;
    startDayOfWeek?: number;
}

export function MonthView({
    currentDate,
    entriesByDate,
    onEntryClick,
    onAddEntry,
    startDayOfWeek = 1
}: MonthViewProps) {
    const grid = getCalendarGrid(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        startDayOfWeek
    );

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const orderedDayNames = [];
    for (let i = 0; i < 7; i++) {
        orderedDayNames.push(dayNames[(i + startDayOfWeek) % 7]);
    }

    return (
        <div className="flex flex-col h-full overflow-hidden border-l border-t border-white/5 rounded-tl-xl">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-zinc-950/50">
                {orderedDayNames.map((name) => (
                    <div key={name} className="py-3 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {name}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 flex-1 overflow-auto bg-black">
                {grid.flat().map((date, i) => {
                    const dateKey = formatDateKey(date);
                    const entries = entriesByDate.get(dateKey) || [];
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                    return (
                        <MonthDayCell
                            key={dateKey}
                            date={date}
                            entries={entries}
                            isCurrentMonth={isCurrentMonth}
                            onEntryClick={onEntryClick}
                            onAddEntry={onAddEntry}
                        />
                    );
                })}
            </div>
        </div>
    );
}
