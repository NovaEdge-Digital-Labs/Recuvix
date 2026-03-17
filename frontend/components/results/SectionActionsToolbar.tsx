"use client";

import { cn } from "@/lib/utils";
import {
    Wand2,
    Plus,
    Minus,
    SpellCheck,
    ChevronDown
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SectionActionsToolbarProps {
    onAction: (action: string) => void;
    isVisible: boolean;
    className?: string;
}

export function SectionActionsToolbar({ onAction, isVisible, className }: SectionActionsToolbarProps) {
    if (!isVisible) return null;

    return (
        <div className={cn(
            "absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-surface-lighter border border-border rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200",
            className
        )}>
            <button
                onClick={() => onAction("rewrite")}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground text-[10px] font-bold transition-all text-muted-foreground"
            >
                <Wand2 size={12} />
                Rewrite
            </button>

            <div className="w-px h-4 bg-border mx-0.5" />

            <button
                onClick={() => onAction("expand")}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface text-[10px] font-medium transition-all text-muted-foreground"
            >
                <Plus size={12} />
                Expand
            </button>

            <button
                onClick={() => onAction("simplify")}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface text-[10px] font-medium transition-all text-muted-foreground"
            >
                <Minus size={12} />
                Simplify
            </button>

            <div className="w-px h-4 bg-border mx-0.5" />

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface text-[10px] font-medium transition-all text-muted-foreground outline-none">
                    <SpellCheck size={12} />
                    More
                    <ChevronDown size={10} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="bg-surface-lighter border-border text-[11px] min-w-[140px]">
                    <DropdownMenuItem onClick={() => onAction("improve_seo")} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        Improve SEO
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("fix_grammar")} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        Fix Grammar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("add_statistics")} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        Add Statistics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("make_scannable")} className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        Make Scannable
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
