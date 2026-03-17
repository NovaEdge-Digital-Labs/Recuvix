import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarEntryPriority } from '@/lib/calendar/calendarService';
import { PRIORITY_CONFIG } from '@/lib/calendar/entryStatusHelpers';
import { X, Send } from 'lucide-react';

interface QuickAddFormProps {
    onAdd: (topic: string, priority: CalendarEntryPriority) => void;
    onCancel: () => void;
    className?: string;
}

export function QuickAddForm({ onAdd, onCancel, className }: QuickAddFormProps) {
    const [topic, setTopic] = useState('');
    const [priority, setPriority] = useState<CalendarEntryPriority>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic.trim().length >= 3) {
            onAdd(topic, priority);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-2 bg-zinc-900 border border-white/10 rounded-lg shadow-xl space-y-2 z-10"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between gap-2">
                <Input
                    autoFocus
                    placeholder="Blog topic..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-8 text-xs bg-black border-white/5 focus-visible:ring-accent"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') onCancel();
                    }}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-50 hover:opacity-100"
                    onClick={onCancel}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Select value={priority} onValueChange={(v) => setPriority(v as CalendarEntryPriority)}>
                    <SelectTrigger className="h-7 text-[10px] w-24 bg-black border-white/5">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key} className="text-[10px]">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${config.color}`} />
                                    {config.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    type="submit"
                    className="h-7 w-full text-[10px] bg-accent hover:bg-accent/90 text-white"
                    disabled={topic.trim().length < 3}
                >
                    <Send className="h-3 w-3 mr-1" />
                    Add
                </Button>
            </div>
        </form>
    );
}
