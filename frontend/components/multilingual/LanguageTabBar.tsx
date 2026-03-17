import React from "react";
import { cn } from "@/lib/utils";
import { LanguageConfig } from "@/lib/config/languageConfig";

interface LanguageTabBarProps {
    languages: LanguageConfig[];
    activeCode: string;
    statusMap: Record<string, "queued" | "generating" | "complete" | "failed">;
    onSelect: (code: string) => void;
}

export function LanguageTabBar({ languages, activeCode, statusMap, onSelect }: LanguageTabBarProps) {
    return (
        <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border mb-6 overflow-x-auto no-scrollbar">
            {languages.map((lang) => {
                const status = statusMap[lang.code] || "queued";
                const isActive = activeCode === lang.code;

                return (
                    <button
                        key={lang.code}
                        onClick={() => onSelect(lang.code)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap",
                            isActive
                                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                        )}
                    >
                        <span className={cn("text-lg", status === "queued" && "grayscale opacity-50")}>
                            {lang.flag}
                        </span>
                        <span className="text-xs font-bold font-sans uppercase tracking-tight">
                            {lang.name}
                        </span>

                        {/* Status Dot */}
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-colors",
                            status === "complete" ? "bg-emerald-500" :
                                status === "generating" ? "bg-primary animate-pulse" :
                                    status === "failed" ? "bg-destructive" :
                                        "bg-muted-foreground/30"
                        )} />

                        {isActive && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
