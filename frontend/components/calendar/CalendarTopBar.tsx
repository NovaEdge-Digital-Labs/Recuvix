import React from 'react';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    Columns2, // Changed from LayoutColumns to Columns2
    Sparkles,
    Download,
    Plus
} from 'lucide-react';
import { CalendarView } from '@/hooks/useCalendar';
import { cn } from '@/lib/utils';

interface CalendarTopBarProps {
    currentDate: Date;
    currentView: CalendarView;
    onViewChange: (view: CalendarView) => void;
    onToday: () => void;
    onPrev: () => void;
    onNext: () => void;
    onAddTopic: () => void;
    onAIInsights: () => void;
    onExport: () => void;
}

export function CalendarTopBar({
    currentDate,
    currentView,
    onViewChange,
    onToday,
    onPrev,
    onNext,
    onAddTopic,
    onAIInsights,
    onExport
}: CalendarTopBarProps) {
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-6">
                {/* Navigation */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onPrev}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="min-w-[140px] text-center">
                        <h2 className="text-lg font-bold text-white">
                            {monthName} <span className="text-zinc-500 font-medium">{year}</span>
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="ml-2 h-8 text-[11px] bg-zinc-900 border-white/5 font-semibold" onClick={onToday}>
                        Today
                    </Button>
                </div>

                {/* View Toggles */}
                <div className="flex items-center bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-7 px-3 text-[11px] rounded-md transition-all", currentView === 'month' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500")}
                        onClick={() => onViewChange('month')}
                    >
                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                        Month
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-7 px-3 text-[11px] rounded-md transition-all", currentView === 'week' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500")}
                        onClick={() => onViewChange('week')}
                    >
                        <Columns2 className="h-3.5 w-3.5 mr-1.5" /> {/* Changed from LayoutColumns to Columns2 */}
                        Week
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn("h-7 px-3 text-[11px] rounded-md transition-all", currentView === 'list' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500")}
                        onClick={() => onViewChange('list')}
                    >
                        <List className="h-3.5 w-3.5 mr-1.5" />
                        List
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="h-9 text-[12px] border-white/5 bg-zinc-900 hover:bg-zinc-800 transition-colors" onClick={onExport}>
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Export
                </Button>
                <Button variant="outline" size="sm" className="h-9 text-[12px] border-white/5 bg-zinc-900 hover:bg-zinc-800 transition-colors" onClick={onAddTopic}>
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    Add Topic
                </Button>
                <Button
                    size="sm"
                    className="h-8 bg-zinc-900 border-white/5 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs"
                    onClick={onAIInsights}
                >
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-accent" />
                    AI Strategy
                </Button>
            </div>
        </div>
    );
}
