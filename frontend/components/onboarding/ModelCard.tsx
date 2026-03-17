import React from "react";
import { cn } from "@/lib/utils";

interface ModelCardProps {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    selected: boolean;
    onSelect: (id: string) => void;
}

export function ModelCard({ id, name, description, icon, selected, onSelect }: ModelCardProps) {
    return (
        <div
            onClick={() => onSelect(id)}
            className={cn(
                "cursor-pointer rounded-xl border p-4 transition-all duration-200",
                selected
                    ? "border-accent bg-accent/5 shadow-[0_0_12px_rgba(232,255,71,0.15)]"
                    : "border-border bg-card hover:border-accent/50"
            )}
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border">
                    {icon}
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground">{name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
