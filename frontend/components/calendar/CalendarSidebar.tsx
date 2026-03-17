import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BarChart3, Sparkles, Settings as SettingsIcon, X, ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { MonthStats, CalendarSettings, CalendarEntry } from '@/lib/calendar/calendarService';
import { cn } from '@/lib/utils';

// We'll implement the actual tab contents in separate components next
interface CalendarSidebarProps {
    stats: MonthStats | null;
    settings: CalendarSettings | null;
    onUpdateSettings: (updates: Partial<CalendarSettings>) => void;
    suggestions: any[];
    isFetchingSuggestions: boolean;
    onFetchSuggestions: (params: any) => void;
    onAddSuggestions: (ids: string[]) => void;
    upcomingEntries: CalendarEntry[];
    isOpen: boolean;
    onToggle: () => void;
}

export function CalendarSidebar({
    stats,
    settings,
    onUpdateSettings,
    suggestions,
    isFetchingSuggestions,
    onFetchSuggestions,
    onAddSuggestions,
    upcomingEntries,
    isOpen,
    onToggle
}: CalendarSidebarProps) {
    const [activeTab, setActiveTab] = useState('stats');

    return (
        <div className={cn(
            "fixed right-0 top-0 h-screen bg-zinc-950 border-l border-white/5 transition-all duration-300 z-40 flex flex-col",
            isOpen ? "w-80" : "w-0 overflow-hidden"
        )}>
            {/* Toggle Button (absolute outside) */}
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "absolute -left-10 top-1/2 -translate-y-1/2 h-20 w-10 rounded-l-xl rounded-r-none border-r-0 border-white/5 bg-zinc-950 hover:bg-zinc-900 transition-colors hidden lg:flex",
                    !isOpen && "left-[-40px]"
                )}
                onClick={onToggle}
            >
                {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Plan Center</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={onToggle}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid grid-cols-3 bg-zinc-900/50 p-1 mx-4 mt-4 h-10 border border-white/5">
                    <TabsTrigger value="stats" className="text-[10px] uppercase font-bold data-[state=active]:bg-zinc-800">
                        <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                        Stats
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="text-[10px] uppercase font-bold data-[state=active]:bg-zinc-800">
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        AI
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="text-[10px] uppercase font-bold data-[state=active]:bg-zinc-800">
                        <SettingsIcon className="h-3.5 w-3.5 mr-1.5" />
                        Config
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <TabsContent value="stats" className="mt-0 outline-none">
                        {stats ? (
                            <div className="space-y-6">
                                <Card className="p-5 bg-gradient-to-br from-zinc-900 to-black border-white/5 shadow-2xl">
                                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 mb-4">Activity Overview</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <p className="text-3xl font-black text-white">{stats.published} <span className="text-xs text-zinc-500 font-medium">/ {stats.total}</span></p>
                                            <p className="text-xs font-bold text-emerald-500">{stats.completion_rate}% Done</p>
                                        </div>
                                        {/* Simplified progress bar */}
                                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent transition-all duration-500"
                                                style={{ width: `${stats.completion_rate}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                <p className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Scheduled</p>
                                                <p className="text-sm font-bold text-white">{stats.scheduled}</p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                                <p className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Planned</p>
                                                <p className="text-sm font-bold text-white">{stats.planned}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 px-1">Content Heatmap</h4>
                                    <div className="grid grid-cols-7 gap-1 bg-zinc-900/30 p-2 rounded-lg border border-white/5">
                                        {Array.from({ length: 28 }).map((_, i) => {
                                            // Mock active days for visual effect, normally we'd map this to real month days
                                            const isActive = i % 3 === 0 || i % 7 === 0;
                                            const isDone = isActive && i % 2 === 0;
                                            return (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "aspect-square rounded-[2px] transition-all",
                                                        !isActive && "bg-white/5 hover:bg-white/10",
                                                        isActive && !isDone && "bg-accent/40 shadow-[0_0_5px_rgba(232,255,71,0.2)]",
                                                        isDone && "bg-emerald-500/40 shadow-[0_0_5px_rgba(16,185,129,0.2)]"
                                                    )}
                                                    title={isActive ? "Activity scheduled" : "No activity"}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <p className="text-[8px] text-zinc-600 uppercase font-bold">Planned</p>
                                        <p className="text-[8px] text-zinc-600 uppercase font-bold">Done</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase font-bold text-zinc-500 px-1">Upcoming Deadlines</h4>
                                    {upcomingEntries.length > 0 ? (
                                        <div className="space-y-2">
                                            {upcomingEntries.map(entry => (
                                                <div key={entry.id} className="p-3 bg-zinc-900/50 rounded-xl border border-white/5 group hover:border-accent/20 transition-all">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-[9px] font-mono text-zinc-500">
                                                            {new Date(entry.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </p>
                                                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 border-white/5 opacity-50 uppercase">{entry.priority}</Badge>
                                                    </div>
                                                    <p className="text-[11px] font-bold text-zinc-200 line-clamp-1 group-hover:text-white">{entry.title || entry.topic}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-zinc-900/50 rounded-xl border border-white/5 text-[11px] text-zinc-500 italic text-center py-8">
                                            No upcoming deadlines
                                        </div>
                                    )}
                                </div>

                                <Card className="p-4 bg-zinc-900/30 border-white/5 border-dashed">
                                    <p className="text-xs text-zinc-400 text-center">
                                        Full Analytics view coming soon
                                    </p>
                                </Card>
                            </div>
                        ) : (
                            <div className="p-10 text-center opacity-30">Loading stats...</div>
                        )}
                    </TabsContent>

                    <TabsContent value="ai" className="mt-0 outline-none">
                        <div className="space-y-4">
                            <div className="bg-accent/10 p-4 rounded-xl border border-accent/20">
                                <h4 className="text-xs font-bold text-accent mb-1 flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Topic Engine
                                </h4>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    AI analyzes your niche and current trends to suggest high-potential topics.
                                </p>
                            </div>

                            {/* Simplified Suggestion Form */}
                            <Button
                                className="w-full bg-accent hover:bg-accent/90 text-black font-bold h-10 shadow-lg shadow-accent/20"
                                onClick={() => onFetchSuggestions({
                                    niche: settings?.primary_niche || 'digital marketing',
                                    country: settings?.default_country || 'United States'
                                })}
                                disabled={isFetchingSuggestions}
                            >
                                {isFetchingSuggestions ? 'Analyzing Trends...' : 'Generate New Ideas'}
                            </Button>

                            {suggestions.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <p className="text-[10px] uppercase font-bold text-zinc-500">Suggested Topics</p>
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="p-3 bg-zinc-900 rounded-xl border border-white/5 group relative hover:border-accent/30 transition-all cursor-pointer">
                                            <p className="text-xs font-bold text-white mb-1 line-clamp-2">{s.title}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] h-4 py-0 px-1 border-white/10 opacity-60 capitalize">{s.contentType}</Badge>
                                                <span className="text-[10px] text-zinc-500">{s.estimatedSearchVolume}</span>
                                            </div>
                                            <Button
                                                size="icon"
                                                className="absolute right-2 bottom-2 h-6 w-6 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform"
                                                onClick={() => onAddSuggestions([s.id])}
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0 outline-none">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Primary Niche</label>
                                    <Input
                                        placeholder="e.g. Finance, Health..."
                                        value={settings?.primary_niche || ''}
                                        onChange={(e) => onUpdateSettings({ primary_niche: e.target.value })}
                                        className="bg-zinc-900/50 border-white/5 h-9 text-xs"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Target Monthly Blogs</label>
                                    <Input
                                        type="number"
                                        value={settings?.target_blogs_per_month || 4}
                                        onChange={(e) => onUpdateSettings({ target_blogs_per_month: parseInt(e.target.value) })}
                                        className="bg-zinc-900/50 border-white/5 h-9 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-zinc-900/30 rounded-xl border border-white/5 space-y-3">
                                <h5 className="text-[10px] uppercase font-bold text-white">View Preferences</h5>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-400">Week starts on Monday</span>
                                    <div className="h-4 w-8 bg-accent rounded-full relative">
                                        <div className="absolute right-0.5 top-0.5 h-3 w-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
