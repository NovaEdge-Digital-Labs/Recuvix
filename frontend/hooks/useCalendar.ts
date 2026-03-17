import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    CalendarEntry,
    CalendarSettings,
    MonthStats,
    calendarService
} from '@/lib/calendar/calendarService';
import {
    formatDateKey,
    getCalendarGrid,
    getWeekDays
} from '@/lib/calendar/dateHelpers';
import { toast } from 'sonner';

export type CalendarView = 'month' | 'week' | 'list';

export function useCalendar(workspaceId?: string) {
    // Date navigation
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState<CalendarView>('month');

    // Data
    const [entries, setEntries] = useState<CalendarEntry[]>([]);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);
    const [monthStats, setMonthStats] = useState<MonthStats | null>(null);
    const [settings, setSettings] = useState<CalendarSettings | null>(null);

    // UI State
    const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [memberFilter, setMemberFilter] = useState<string | null>(null);

    // Suggestions
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

    const entriesByDate = useMemo(() => {
        const map = new Map<string, CalendarEntry[]>();
        entries.forEach(entry => {
            const key = entry.scheduled_date;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(entry);
        });
        return map;
    }, [entries]);

    const upcomingEntries = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return entries
            .filter(e => e.scheduled_date >= todayStr && e.status !== 'published' && e.status !== 'cancelled')
            .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
            .slice(0, 5);
    }, [entries]);

    const fetchEntries = useCallback(async () => {
        setIsLoadingEntries(true);
        try {
            let startDate: string;
            let endDate: string;

            if (currentView === 'month') {
                const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                startDate = formatDateKey(firstDay);
                endDate = formatDateKey(lastDay);
            } else if (currentView === 'week') {
                const days = getWeekDays(currentDate, settings?.start_day_of_week ?? 1);
                startDate = formatDateKey(days[0]);
                endDate = formatDateKey(days[6]);
            } else {
                // List view: current month + next month
                const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
                startDate = formatDateKey(firstDay);
                endDate = formatDateKey(lastDay);
            }

            const fetchedEntries = await calendarService.getEntries({
                startDate,
                endDate,
                workspaceId,
            });
            setEntries(fetchedEntries);

            // Fetch stats for the month
            const stats = await calendarService.getMonthStats(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                workspaceId
            );
            setMonthStats(stats);
        } catch (error: any) {
            toast.error('Failed to fetch calendar entries');
        } finally {
            setIsLoadingEntries(false);
        }
    }, [currentDate, currentView, workspaceId, settings]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const fetchSettings = useCallback(async () => {
        try {
            const s = await calendarService.getSettings();
            setSettings(s);
            if (s.default_view) setCurrentView(s.default_view as CalendarView);
        } catch (error: any) {
            console.error('Failed to fetch calendar settings', error);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const navigateMonth = (direction: -1 | 1) => {
        const next = new Date(currentDate);
        next.setMonth(next.getMonth() + direction);
        setCurrentDate(next);
    };

    const navigateToToday = () => {
        setCurrentDate(new Date());
    };

    const navigateDate = (action: 'prev' | 'next' | 'today') => {
        if (action === 'today') {
            navigateToToday();
        } else {
            navigateMonth(action === 'next' ? 1 : -1);
        }
    };

    const createEntry = async (data: Partial<CalendarEntry>) => {
        try {
            const newEntry = await calendarService.createEntry({
                ...data,
                workspace_id: workspaceId || data.workspace_id,
            });
            setEntries(prev => [...prev, newEntry].sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)));
            fetchEntries(); // Refresh stats
            return newEntry;
        } catch (error: any) {
            toast.error('Failed to create calendar entry');
            throw error;
        }
    };

    const updateEntry = async (id: string, updates: Partial<CalendarEntry>) => {
        const originalEntries = [...entries];
        // Optimistic update
        setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));

        try {
            await calendarService.updateEntry(id, updates);
            if (selectedEntry?.id === id) {
                setSelectedEntry(prev => prev ? { ...prev, ...updates } : null);
            }
            fetchEntries(); // Refresh stats
        } catch (error: any) {
            setEntries(originalEntries);
            toast.error('Failed to update calendar entry');
        }
    };

    const deleteEntry = async (id: string, permanent: boolean = false) => {
        try {
            await calendarService.deleteEntry(id, permanent);
            setEntries(prev => prev.filter(e => e.id !== id));
            if (selectedEntry?.id === id) {
                setIsPanelOpen(false);
                setSelectedEntry(null);
            }
            fetchEntries(); // Refresh stats
        } catch (error: any) {
            toast.error('Failed to delete entry');
        }
    };

    const moveEntry = async (id: string, newDate: string) => {
        return updateEntry(id, { scheduled_date: newDate });
    };

    const selectEntry = (entry: CalendarEntry) => {
        setSelectedEntry(entry);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
        setSelectedEntry(null);
    };

    const fetchSuggestions = async (params: any) => {
        setIsFetchingSuggestions(true);
        try {
            const response = await fetch('/api/calendar/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setSuggestions(data.suggestions);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch suggestions');
        } finally {
            setIsFetchingSuggestions(false);
        }
    };

    const addSuggestionsToCalendar = async (selectedIds: string[]) => {
        const toAdd = suggestions.filter(s => selectedIds.includes(s.id));
        try {
            await calendarService.bulkCreateEntries(toAdd, workspaceId);
            toast.success(`Added ${toAdd.length} topics to your calendar`);
            fetchEntries();
            setSuggestions(prev => prev.filter(s => !selectedIds.includes(s.id)));
        } catch (error: any) {
            toast.error('Failed to add suggestions to calendar');
        }
    };

    const updateCalendarSettings = async (updates: Partial<CalendarSettings>) => {
        try {
            const next = await calendarService.updateSettings(updates);
            setSettings(next);
            toast.success('Your calendar preferences have been updated');
        } catch (error: any) {
            toast.error('Failed to save settings');
        }
    };

    return {
        currentDate,
        setCurrentDate,
        currentView,
        setView: setCurrentView,
        navigateMonth,
        navigateToToday,
        navigateDate,
        entries,
        entriesByDate,
        upcomingEntries,
        isLoadingEntries,
        monthStats,
        fetchEntries,

        selectedEntry,
        isPanelOpen,
        selectEntry,
        closePanel,

        createEntry,
        updateEntry,
        deleteEntry,
        moveEntry,

        suggestions,
        isFetchingSuggestions,
        fetchSuggestions,
        addSuggestionsToCalendar,

        settings,
        updateSettings: updateCalendarSettings,

        memberFilter,
        setMemberFilter,
        activeWorkspaceId: workspaceId || null,
    };
}
