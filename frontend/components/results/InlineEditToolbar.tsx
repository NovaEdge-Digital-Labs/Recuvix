"use client";

import {
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Heading2,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InlineEditToolbarProps {
    onSave: () => void;
    onCancel: () => void;
    className?: string;
}

export function InlineEditToolbar({ onSave, onCancel, className }: InlineEditToolbarProps) {
    // These functions would typically interact with a contentEditable or markdown editor
    // For now, they act as UI indicators for the manual edit mode

    return (
        <div className={cn(
            "flex items-center gap-1 p-1 bg-surface-lighter border border-border rounded-lg shadow-xl animate-in fade-in zoom-in-95",
            className
        )}>
            <div className="flex items-center gap-0.5 px-1 border-r border-border mr-1">
                <ToolbarButton icon={<Bold size={14} />} title="Bold (Ctrl+B)" />
                <ToolbarButton icon={<Italic size={14} />} title="Italic (Ctrl+I)" />
                <ToolbarButton icon={<LinkIcon size={14} />} title="Insert Link" />
            </div>

            <div className="flex items-center gap-0.5 px-1 border-r border-border mr-1">
                <ToolbarButton icon={<Heading2 size={14} />} title="Convert to H2" />
                <ToolbarButton icon={<List size={14} />} title="Bullet List" />
            </div>

            <div className="flex items-center gap-2 px-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-7 px-2 text-[10px] text-muted-foreground hover:bg-surface"
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    onClick={onSave}
                    className="h-7 px-3 text-[10px] bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                >
                    <Save size={12} className="mr-1.5" />
                    Save
                </Button>
            </div>
        </div>
    );
}

function ToolbarButton({ icon, title, active, onClick }: { icon: React.ReactNode, title: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            title={title}
            onClick={onClick}
            className={cn(
                "p-1.5 rounded transition-all",
                active ? "bg-accent/20 text-accent" : "text-muted-foreground hover:bg-surface hover:text-foreground"
            )}
        >
            {icon}
        </button>
    );
}
