"use client";

import { useAppContext } from "@/context/AppContext";
import { modelIcons } from "@/lib/modelIcons";

export function ModelPill() {
    const { apiConfig } = useAppContext();

    if (!apiConfig.selectedModel) return null;

    const valid = !!apiConfig.apiKey;

    return (
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-sm hover:border-accent/50 transition-colors">
            <span className="text-muted-foreground">{modelIcons[apiConfig.selectedModel]}</span>
            <span className="capitalize text-foreground font-medium">{apiConfig.selectedModel}</span>
            <span className={`w-2 h-2 rounded-full ${valid ? "bg-[#44ff88]" : "bg-destructive"} shadow-[0_0_8px_currentColor] opacity-80`}></span>
        </button>
    );
}
