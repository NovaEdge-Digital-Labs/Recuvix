import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { StorageBar } from './StorageBar';
import {
    Database,
    Trash2,
    Download,
    AlertTriangle,
    History,
    Archive,
    ArrowRight
} from 'lucide-react';


interface StorageManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storageUsage: any;
    onClearNonStarred: () => void;
    onClearAll: () => void;
    onExportAll: () => Promise<void>;
}

export const StorageManagementModal: React.FC<StorageManagementModalProps> = ({
    isOpen,
    onClose,
    storageUsage,
    onClearNonStarred,
    onClearAll,
    onExportAll
}) => {
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'confirm_all' | 'confirm_non_starred'>('idle');
    const [confirmText, setConfirmText] = useState('');
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        await onExportAll();
        setExporting(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-background border-slate-800 text-white max-w-md">
                <DialogHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-4">
                        <Database size={24} />
                    </div>
                    <DialogTitle className="text-xl font-bold">Manage History Storage</DialogTitle>
                    <DialogDescription className="text-muted-foreground/80">
                        You can save up to 50 blogs in your local browser history.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-8">
                    {/* Usage Visual */}
                    <div className="bg-card/50 rounded-2xl p-4 border border-slate-800/50">
                        <StorageBar used={storageUsage.totalBlogs} />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Favorites</div>
                                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                                    <Archive size={14} className="text-accent" /> {storageUsage.starredCount} blogs
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Space Free</div>
                                <div className="text-sm font-bold text-accent">{storageUsage.availableSlots} slots</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Sections */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Cleanup Actions</h4>

                        <div className="space-y-2">
                            <button
                                onClick={() => setDeleteStatus('confirm_non_starred')}
                                className="w-full flex items-center justify-between p-4 bg-card hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                        <History size={16} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold">Clear Non-Starred</div>
                                        <div className="text-[11px] text-muted-foreground">Deletes {storageUsage.totalBlogs - storageUsage.starredCount} entries</div>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-slate-600" />
                            </button>

                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="w-full flex items-center justify-between p-4 bg-card hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                                        <Download size={16} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold">Export All History</div>
                                        <div className="text-[11px] text-muted-foreground">Save all {storageUsage.totalBlogs} blogs to ZIP</div>
                                    </div>
                                </div>
                                {exporting ? <div className="w-4 h-4 border-2 border-accent border-t-transparent animate-spin rounded-full" /> : <ArrowRight size={16} className="text-slate-600" />}
                            </button>

                            <button
                                onClick={() => setDeleteStatus('confirm_all')}
                                className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                                        <Trash2 size={16} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-red-400">Nuclear Option</div>
                                        <div className="text-[11px] text-red-500/60 text-left">Permanently delete everything</div>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-red-500/40" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Confirmation Overlays */}
                {deleteStatus !== 'idle' && (
                    <div className="absolute inset-0 z-50 bg-background rounded-lg p-6 flex flex-col justify-center animate-in fade-in duration-200">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Are you sure?</h3>
                        <p className="text-muted-foreground/80 text-sm text-center mb-8 px-4">
                            {deleteStatus === 'confirm_all'
                                ? 'This will permanently delete every single blog including your favorites. This cannot be undone.'
                                : 'This will remove all blogs that are not starred. Your favorites will be preserved.'}
                        </p>

                        {deleteStatus === 'confirm_all' && (
                            <div className="mb-6 space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center block">Type &ldquo;DELETE&rdquo; to confirm</label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="w-full bg-card border border-slate-800 rounded-lg px-4 py-2 text-center text-red-400 focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setDeleteStatus('idle'); setConfirmText(''); }}
                                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deleteStatus === 'confirm_all' && confirmText !== 'DELETE'}
                                onClick={() => {
                                    if (deleteStatus === 'confirm_all') onClearAll();
                                    else onClearNonStarred();
                                    setDeleteStatus('idle');
                                    setConfirmText('');
                                    onClose();
                                }}
                                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-500 text-white font-bold rounded-xl transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}

                <DialogFooter className="sm:justify-start">
                    <button
                        onClick={onClose}
                        className="text-[11px] text-muted-foreground hover:text-white transition-colors uppercase tracking-widest font-bold"
                    >
                        Close
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
