import React, { useState } from 'react';
import { CalendarEntry } from '@/lib/calendar/calendarService';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/calendar/entryStatusHelpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatCalendarDate } from '@/lib/calendar/dateHelpers';
import { ArrowRight, Edit2, MoreHorizontal, List } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

interface ListViewProps {
    entries: CalendarEntry[];
    onEntryClick: (entry: CalendarEntry) => void;
    onGenerate: (entry: CalendarEntry) => void;
}

export function ListView({ entries, onEntryClick, onGenerate }: ListViewProps) {
    const [sortKey, setSortKey] = useState<keyof CalendarEntry>('scheduled_date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const sortedEntries = [...entries].sort((a, b) => {
        const valA = a[sortKey] || '';
        const valB = b[sortKey] || '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof CalendarEntry) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-zinc-950 p-6">
            <div className="max-w-6xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                        Detailed Content Plan
                    </h3>
                    <Badge variant="outline" className="border-white/5 bg-zinc-900 text-zinc-500">
                        {entries.length} Topics total
                    </Badge>
                </div>

                <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl">
                    <Table>
                        <TableHeader className="bg-zinc-900/50">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 cursor-pointer" onClick={() => handleSort('scheduled_date')}>
                                    Date
                                </TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 cursor-pointer" onClick={() => handleSort('title')}>
                                    Content Piece
                                </TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 cursor-pointer" onClick={() => handleSort('status')}>
                                    Status
                                </TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 cursor-pointer" onClick={() => handleSort('priority')}>
                                    Priority
                                </TableHead>
                                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedEntries.map((entry) => {
                                const status = STATUS_CONFIG[entry.status];
                                const priority = PRIORITY_CONFIG[entry.priority];

                                return (
                                    <TableRow key={entry.id} className="border-white/5 hover:bg-zinc-900/30 transition-colors group">
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">
                                                    {formatCalendarDate(new Date(entry.scheduled_date))}
                                                </span>
                                                <span className="text-[10px] text-zinc-500">
                                                    {new Date(entry.scheduled_date).getFullYear()}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 max-w-sm">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                                                    {entry.title}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-zinc-500 line-clamp-1">{entry.topic}</span>
                                                    {entry.focus_keyword && (
                                                        <Badge variant="outline" className="text-[9px] h-4 border-white/5 bg-zinc-900 text-zinc-400">
                                                            {entry.focus_keyword}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={cn("text-[10px] uppercase font-bold px-2 py-0.5", status.bgColor, status.color)}>
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", priority.color)} />
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase">{priority.label}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {entry.status !== 'published' ? (
                                                    <Button
                                                        size="sm"
                                                        className="h-8 text-[11px] bg-accent hover:bg-accent/90 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => onGenerate(entry)}
                                                    >
                                                        <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                                                        Generate
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-[11px] text-emerald-500 hover:text-emerald-400 font-bold border border-emerald-500/10"
                                                        onClick={() => onEntryClick(entry)}
                                                    >
                                                        View
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-500 hover:text-white"
                                                    onClick={() => onEntryClick(entry)}
                                                >
                                                    <Edit2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {sortedEntries.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                <List className="h-8 w-8 text-zinc-600" />
                            </div>
                            <div>
                                <p className="text-zinc-400 font-bold">No planned topics yet</p>
                                <p className="text-xs text-zinc-600">Start by adding topics to your calendar</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
