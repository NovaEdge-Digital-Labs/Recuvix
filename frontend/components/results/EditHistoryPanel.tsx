"use client";

import { EditHistoryEntry as EditHistoryEntryType } from "@/lib/types/editor";
import { EditHistoryEntry } from "./EditHistoryEntry";
import { History, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditHistoryPanelProps {
    history: EditHistoryEntryType[];
    onRestore: (id: string) => void;
    onClear: () => void;
    onClose: () => void;
}

export function EditHistoryPanel({ history, onRestore, onClear, onClose }: EditHistoryPanelProps) {
    return (
        <div className="w-[300px] border-l border-border bg-surface/50 backdrop-blur-xl flex flex-col h-full animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-accent" />
                    <h3 className="text-sm font-bold text-foreground">Edit History</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-lighter text-muted-foreground font-mono">
                        {history.length}
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-surface-lighter">
                    <X size={16} />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-5">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-surface-lighter flex items-center justify-center">
                            <History size={24} className="text-muted-foreground/30" />
                        </div>
                        <p className="text-xs text-muted-foreground">No edits yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {history.map((entry, index) => (
                            <EditHistoryEntry
                                key={entry.id}
                                entry={entry}
                                onRestore={onRestore}
                                isLatest={index === 0}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>

            {history.length > 0 && (
                <div className="p-4 border-t border-border">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                        className="w-full text-xs text-red-400 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30"
                    >
                        <Trash2 size={12} className="mr-2" />
                        Clear History
                    </Button>
                </div>
            )}
        </div>
    );
}
