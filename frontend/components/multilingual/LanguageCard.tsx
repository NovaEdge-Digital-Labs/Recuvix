import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageConfig } from "@/lib/config/languageConfig";

interface LanguageCardProps {
    language: LanguageConfig;
    selected: boolean;
    disabled?: boolean;
    onSelect: (code: string) => void;
}

export function LanguageCard({ language, selected, disabled, onSelect }: LanguageCardProps) {
    return (
        <div
            onClick={() => !disabled && onSelect(language.code)}
            className={cn(
                "relative flex flex-col p-4 rounded-xl border-2 transition-all cursor-pointer select-none",
                "bg-card hover:border-primary/50",
                selected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-muted bg-muted/20 opacity-70 hover:opacity-100",
                disabled && "cursor-not-allowed opacity-50 grayscale pointer-events-none"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-3xl leading-none">{language.flag}</span>
                {selected && (
                    <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-4 h-4" />
                    </div>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-bold truncate">{language.name}</span>
                <span className="text-xs text-muted-foreground truncate uppercase tracking-wider font-medium">
                    {language.nativeName}
                </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <div className={cn(
                    "w-3 h-3 rounded-full border",
                    selected ? "bg-primary border-primary" : "bg-transparent border-muted-foreground/30"
                )} />
                <span className={cn(
                    "text-[10px] font-semibold uppercase tracking-tighter",
                    selected ? "text-primary" : "text-muted-foreground"
                )}>
                    {selected ? "Selected" : "Select"}
                </span>
            </div>
        </div>
    );
}
