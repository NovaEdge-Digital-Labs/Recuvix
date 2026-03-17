"use client";

import { EditHistoryEntry as EditHistoryEntryType } from "@/lib/types/editor";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EditHistoryEntryProps {
    entry: EditHistoryEntryType;
    onRestore: (id: string) => void;
    isLatest: boolean;
}

export function EditHistoryEntry({ entry, onRestore, isLatest }: EditHistoryEntryProps) {

    const getTime = () => {
        return new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={cn(
            "group relative pl-6 pb-6 border-l border-border hover:border-accent/30 transition-colors last:pb-0",
            isLatest && "border-accent/50"
        )}>
            <div className={cn(
                "absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-background",
                isLatest ? "bg-accent scale-125" : "bg-muted-foreground group-hover:bg-accent/50"
            )} />

            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{getTime()}</span>
                        <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                            entry.type === "full_regen" && "bg-blue-500/10 text-blue-400",
                            entry.type === "section_regen" && "bg-purple-500/10 text-purple-400",
                            entry.type === "section_edit" && "bg-accent/10 text-accent"
                        )}>
                            {entry.type.replace("_", " ")}
                        </span>
                    </div>
                    {!isLatest && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRestore(entry.id)}
                            className="h-6 px-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/10 hover:text-accent"
                        >
                            Restore
                        </Button>
                    )}
                </div>

                <p className="text-xs font-medium text-foreground leading-snug">
                    {entry.description}
                </p>

                {entry.instruction && (
                    <p className="text-[10px] text-muted-foreground italic line-clamp-2">
                        &ldquo;{entry.instruction}&rdquo;
                    </p>
                )}
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EditHistoryIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}
