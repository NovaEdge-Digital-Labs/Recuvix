import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarEntry, CalendarEntryStatus, CalendarEntryPriority } from '@/lib/calendar/calendarService';
import { STATUS_CONFIG, PRIORITY_CONFIG, CONTENT_TYPE_LABELS } from '@/lib/calendar/entryStatusHelpers';
import { cn } from '@/lib/utils';
import { X, Calendar as CalendarIcon, Clock, Type, Tag, Globe, Sparkles, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import {
    Sheet as ShadcnSheet,
    SheetContent as ShadcnSheetContent,
    SheetHeader as ShadcnSheetHeader,
    SheetTitle as ShadcnSheetTitle
} from '@/components/ui/sheet';

interface EntryDetailPanelProps {
    entry: CalendarEntry | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (id: string, updates: Partial<CalendarEntry>) => void;
    onDelete: (id: string) => void;
    onGenerate: (entry: CalendarEntry) => void;
}

export function EntryDetailPanel({
    entry,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    onGenerate
}: EntryDetailPanelProps) {
    const [formData, setFormData] = useState<Partial<CalendarEntry>>({});

    useEffect(() => {
        if (entry) {
            setFormData(entry);
        }
    }, [entry]);

    if (!entry) return null;

    const status = STATUS_CONFIG[entry.status];
    const priority = PRIORITY_CONFIG[entry.priority];

    const handleSave = () => {
        onUpdate(entry.id, formData);
    };

    return (
        <ShadcnSheet open={isOpen} onOpenChange={onClose}>
            <ShadcnSheetContent className="w-full sm:max-w-md bg-zinc-950 border-white/5 p-0 overflow-y-auto">
                <ShadcnSheetHeader className="p-6 border-b border-white/5 sticky top-0 bg-zinc-950 z-10">
                    <div className="flex items-center justify-between mb-2">
                        <Badge className={cn("text-[10px] uppercase font-bold", status.bgColor, status.color)}>
                            {status.label}
                        </Badge>
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", priority.color)} />
                            <span className="text-[10px] uppercase font-bold text-zinc-500">{priority.label}</span>
                        </div>
                    </div>
                    <ShadcnSheetTitle>
                        <Input
                            value={formData.title || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            onBlur={handleSave}
                            className="text-xl font-bold bg-transparent border-none p-0 focus-visible:ring-0 placeholder:text-zinc-700"
                            placeholder="Post Title"
                        />
                    </ShadcnSheetTitle>
                </ShadcnSheetHeader>

                <div className="p-6 space-y-8">
                    {/* Main Info */}
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-500">Topic Prompt</label>
                            <Textarea
                                value={formData.topic || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                                onBlur={handleSave}
                                className="bg-zinc-900/50 border-white/5 focus-visible:ring-accent min-h-[80px] text-sm"
                                placeholder="What is this blog about?"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Scheduled Date</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={formData.scheduled_date || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                                        onBlur={handleSave}
                                        className="bg-zinc-900/50 border-white/5 h-9 text-sm pl-8"
                                    />
                                    <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Scheduled Time</label>
                                <div className="relative">
                                    <Input
                                        type="time"
                                        value={formData.scheduled_time || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                                        onBlur={handleSave}
                                        className="bg-zinc-900/50 border-white/5 h-9 text-sm pl-8"
                                    />
                                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Details */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-accent" />
                            SEO & Content Parameters
                        </h3>

                        <div className="grid gap-4 bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Focus Keyword</label>
                                <Input
                                    value={formData.focus_keyword || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, focus_keyword: e.target.value }))}
                                    onBlur={handleSave}
                                    className="bg-zinc-900/50 border-white/5 h-9 text-sm"
                                    placeholder="e.g. digital marketing tips"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Target Country</label>
                                    <Select
                                        value={formData.country || 'india'}
                                        onValueChange={(v) => {
                                            setFormData(prev => ({ ...prev, country: v as string }));
                                            onUpdate(entry.id, { country: v as string });
                                        }}
                                    >
                                        <SelectTrigger className="bg-zinc-900/50 border-white/5 h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10">
                                            <SelectItem value="india">India</SelectItem>
                                            <SelectItem value="usa">USA</SelectItem>
                                            <SelectItem value="uk">UK</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500">Content Type</label>
                                    <Select
                                        value={formData.content_type || 'blog'}
                                        onValueChange={(v) => {
                                            setFormData(prev => ({ ...prev, content_type: v }));
                                            onUpdate(entry.id, { content_type: v });
                                        }}
                                    >
                                        <SelectTrigger className="bg-zinc-900/50 border-white/5 h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-950 border-white/10">
                                            {Object.entries(CONTENT_TYPE_LABELS).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Context (if any) */}
                    {(entry.is_ai_suggested || entry.ai_suggestion_reason || entry.seasonality_note) && (
                        <div className="bg-accent/5 rounded-xl p-4 border border-accent/10 space-y-3">
                            <h3 className="text-[10px] uppercase font-bold text-accent flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                AI Strategy Insight
                            </h3>
                            {entry.ai_suggestion_reason && (
                                <p className="text-xs text-zinc-300 leading-relaxed italic">"{entry.ai_suggestion_reason}"</p>
                            )}
                            {entry.seasonality_note && (
                                <div className="flex items-start gap-2 pt-1 border-t border-accent/10 mt-2">
                                    <Badge variant="outline" className="text-[9px] border-accent/20 bg-accent/5 text-accent h-4 mt-0.5">Seasonal</Badge>
                                    <p className="text-[11px] text-zinc-400">{entry.seasonality_note}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                            Internal Notes
                        </h3>
                        <Textarea
                            value={formData.notes || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            onBlur={handleSave}
                            className="bg-zinc-900/50 border-white/5 focus-visible:ring-zinc-700 min-h-[100px] text-sm"
                            placeholder="Research links, content brief, key points to cover..."
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 p-6 bg-zinc-950 border-t border-white/5 flex flex-col gap-3">
                    {entry.status !== 'published' ? (
                        <Button
                            className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-bold text-sm"
                            onClick={() => onGenerate(entry)}
                        >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Generate This Blog
                        </Button>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-500">Blog Published ✓</span>
                            <Button variant="link" className="text-[11px] p-0 h-auto text-emerald-400">View Blog</Button>
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        className="w-full text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 text-[11px] font-bold"
                        onClick={() => onDelete(entry.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete Entry
                    </Button>
                </div>
            </ShadcnSheetContent>
        </ShadcnSheet>
    );
}
