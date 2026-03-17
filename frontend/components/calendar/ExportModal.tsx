import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileDown, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { calendarService } from '@/lib/calendar/calendarService';
import { toast } from 'sonner';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceId?: string;
}

export function ExportModal({ isOpen, onClose, workspaceId }: ExportModalProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: 'csv' | 'ical') => {
        setIsExporting(true);
        try {
            // Get current month range for export
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

            const result = await calendarService.exportCalendar({
                startDate: start,
                endDate: end,
                format: format,
                workspaceId: workspaceId
            });

            const blob = result instanceof Blob ? result : new Blob([result], { type: format === 'csv' ? 'text/csv' : 'text/calendar' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recuvix-calendar-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'ics'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success(`Calendar exported as ${format.toUpperCase()}`);
            onClose();
        } catch (error) {
            toast.error('Failed to export calendar');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-white/5 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Download className="h-5 w-5 text-accent" />
                        Export Calendar
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Download your content schedule to use in other applications or for reporting.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-6">
                    <button
                        onClick={() => handleExport('csv')}
                        disabled={isExporting}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-accent/20 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileDown className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="text-center">
                            <span className="block text-sm font-bold text-white">CSV Format</span>
                            <span className="text-[10px] text-zinc-500">Best for Excel/Sheets</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleExport('ical')}
                        disabled={isExporting}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-accent/20 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CalendarIcon className="h-6 w-6 text-accent" />
                        </div>
                        <div className="text-center">
                            <span className="block text-sm font-bold text-white">iCal Format</span>
                            <span className="text-[10px] text-zinc-500">Google/Apple/Outlook</span>
                        </div>
                    </button>
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="bg-white/5 hover:bg-white/10 text-white border-none"
                    >
                        Cancel
                    </Button>
                    {isExporting && (
                        <div className="ml-auto flex items-center gap-2 text-xs text-accent animate-pulse">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Generating file...
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
