'use client';

import React, { useState } from 'react';
import { useCalendar, CalendarView } from '@/hooks/useCalendar';
import { useWorkspace } from '@/context/WorkspaceContext';
import { CalendarTopBar } from '@/components/calendar/CalendarTopBar';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { ListView } from '@/components/calendar/ListView';
import { EntryDetailPanel } from '@/components/calendar/EntryDetailPanel';
import { ExportModal } from '@/components/calendar/ExportModal';
import { CalendarSidebar } from '@/components/calendar/CalendarSidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CalendarEntry } from '@/lib/calendar/calendarService';

export default function CalendarPage() {
    const router = useRouter();
    const { activeWorkspace } = useWorkspace();
    const workspaceId = activeWorkspace?.id;

    const {
        currentDate,
        currentView,
        setView,
        navigateDate, // Changed from navigateMonth, navigateToToday
        entries,
        entriesByDate,
        upcomingEntries,
        isLoadingEntries,
        monthStats,
        createEntry,
        updateEntry,
        deleteEntry,
        moveEntry,
        suggestions,
        isFetchingSuggestions,
        fetchSuggestions,
        addSuggestionsToCalendar,
        settings,
        updateSettings
    } = useCalendar(workspaceId); // Changed to use workspaceId

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null); // New state for selected entry
    const [isExportModalOpen, setIsExportModalOpen] = useState(false); // New state for export modal

    const handleGenerate = (entry: CalendarEntry) => {
        // 1. Prepare pre-fill data
        const prefillData = {
            calendarEntryId: entry.id,
            topic: entry.topic,
            title: entry.title,
            focusKeyword: entry.focus_keyword,
            secondaryKeywords: entry.secondary_keywords,
            country: entry.country,
            targetTone: entry.target_tone || 'professional',
            targetWordCount: entry.target_word_count || 1500,
            scheduledDate: entry.scheduled_date,
        };

        // 2. Save to localStorage
        localStorage.setItem('recuvix_calendar_prefill', JSON.stringify(prefillData));

        // 3. Navigate to home (generation form)
        router.push('/');
    };

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                isSidebarOpen ? "lg:mr-80" : "mr-0"
            )}>
                <CalendarTopBar
                    currentDate={currentDate}
                    currentView={currentView}
                    onViewChange={setView}
                    onToday={() => navigateDate('today')} // Updated
                    onPrev={() => navigateDate('prev')} // New
                    onNext={() => navigateDate('next')} // New
                    onAddTopic={() => {
                        // Simplified: creates a new entry on today's date or current view center
                        createEntry({
                            title: 'New Topic', // Changed default title
                            topic: '',
                            scheduled_date: new Date().toISOString().split('T')[0],
                            status: 'planned'
                        }).then(entry => setSelectedEntry(entry)); // Updated to setSelectedEntry
                    }}
                    onAIInsights={() => {
                        fetchSuggestions({
                            niche: settings?.primary_niche || 'general',
                            country: settings?.default_country || 'United States'
                        });
                    }} // Changed from onAiSuggestions
                    onExport={() => setIsExportModalOpen(true)} // Updated
                />

                <div className="flex-1 overflow-hidden">
                    {currentView === 'month' && (
                        <MonthView
                            currentDate={currentDate}
                            entriesByDate={entriesByDate}
                            onEntryClick={setSelectedEntry} // Updated
                            onAddEntry={(date, topic, priority) => {
                                createEntry({
                                    scheduled_date: date,
                                    topic,
                                    title: topic, // Default title to topic
                                    priority,
                                    status: 'planned'
                                });
                            }}
                            startDayOfWeek={settings?.start_day_of_week ?? 1}
                        />
                    )}

                    {currentView === 'week' && (
                        <WeekView
                            currentDate={currentDate}
                            entriesByDate={entriesByDate}
                            onEntryClick={setSelectedEntry} // Updated
                            onGenerate={handleGenerate}
                            onAddEntry={(date) => {
                                createEntry({
                                    scheduled_date: date,
                                    topic: '',
                                    title: 'New Topic',
                                    status: 'planned'
                                }).then(entry => setSelectedEntry(entry)); // Updated to setSelectedEntry
                            }}
                            startDayOfWeek={settings?.start_day_of_week ?? 1}
                        />
                    )}

                    {currentView === 'list' && (
                        <ListView
                            entries={entries}
                            onEntryClick={setSelectedEntry} // Updated
                            onGenerate={handleGenerate}
                        />
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <CalendarSidebar
                stats={monthStats}
                settings={settings}
                onUpdateSettings={updateSettings}
                suggestions={suggestions}
                isFetchingSuggestions={isFetchingSuggestions}
                onFetchSuggestions={fetchSuggestions}
                onAddSuggestions={addSuggestionsToCalendar}
                upcomingEntries={upcomingEntries}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Detail Slide Panel */}
            <EntryDetailPanel
                entry={selectedEntry} // Updated
                isOpen={!!selectedEntry} // Updated
                onClose={() => setSelectedEntry(null)} // Updated
                onUpdate={updateEntry}
                onDelete={deleteEntry}
                onGenerate={handleGenerate}
            />

            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                workspaceId={workspaceId}
            />
        </div>
    );
}
