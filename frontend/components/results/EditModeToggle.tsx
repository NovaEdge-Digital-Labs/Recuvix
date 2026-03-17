"use client";

import { cn } from "@/lib/utils";
import { Edit2 } from "lucide-react";

interface EditModeToggleProps {
    isEditMode: boolean;
    onToggle: () => void;
    disabled?: boolean;
}

export function EditModeToggle({ isEditMode, onToggle, disabled }: EditModeToggleProps) {
    return (
        <button
            onClick={onToggle}
            disabled={disabled}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                isEditMode
                    ? "bg-accent text-accent-foreground border-accent shadow-[0_0_10px_rgba(232,255,71,0.2)]"
                    : "bg-surface text-muted-foreground border-border hover:border-muted-foreground/50",
                disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
        >
            <Edit2 size={12} className={cn(isEditMode ? "text-accent-foreground" : "text-muted-foreground")} />
            {isEditMode ? "Editing" : "Edit Mode"}
            <div className={cn(
                "w-2 h-2 rounded-full",
                isEditMode ? "bg-accent-foreground animate-pulse" : "bg-muted-foreground/30"
            )} />
        </button>
    );
}
