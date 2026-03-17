"use client";

import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import { Coins, Key, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function GenerationModeSelector() {
    const { isManagedMode, balance, isLoading } = useCredits();

    // Note: Mode toggling should update the profile in the database.
    // This component will be used inside the blog form.

    const toggleMode = async (mode: 'managed' | 'byok') => {
        try {
            const res = await fetch('/api/profile/update-mode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to update mode');
            }

            toast.success(`Switched to ${mode === 'managed' ? 'Managed' : 'BYOK'} mode`);

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error: any) {
            console.error('Failed to update mode:', error);
            toast.error(error.message || 'Failed to update mode');
        }
    };

    return (
        <div className="flex flex-col gap-3 p-5 rounded-2xl border bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                        Engine Mode
                    </h3>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="p-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-700 transition-colors">
                                    <Info size={10} className="text-zinc-400" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-zinc-900 border-zinc-800 text-zinc-300 shadow-2xl">
                                <p className="w-64 text-[11px] leading-relaxed">
                                    <span className="text-accent font-bold">Managed Mode:</span> We use our high-tier platform keys. Consumes 1 credit per generation.<br /><br />
                                    <span className="text-white font-bold">BYOK Mode:</span> Use your own API keys. Credits are not deducted.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {!isLoading && isManagedMode && (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
                        <Coins size={10} className="text-accent" />
                        <span className="text-[10px] font-black text-accent tabular-nums">
                            {balance ?? 0}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <button
                    type="button"
                    onClick={() => toggleMode('managed')}
                    className={cn(
                        "relative group/btn flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-300",
                        isManagedMode
                            ? "bg-accent border-accent text-zinc-950 shadow-[0_0_25px_rgba(232,255,71,0.2)]"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    )}
                >
                    <Coins size={20} className={cn("transition-transform duration-300", isManagedMode ? "scale-110" : "group-hover/btn:scale-110")} />
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold leading-tight">Managed</span>
                        <span className={cn("text-[9px] font-medium opacity-60", isManagedMode ? "text-zinc-900" : "text-zinc-500")}>
                            Platform Keys
                        </span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => toggleMode('byok')}
                    className={cn(
                        "relative group/btn flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-300",
                        !isManagedMode
                            ? "bg-accent border-accent text-zinc-950 shadow-[0_0_25px_rgba(232,255,71,0.2)]"
                            : "bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    )}
                >
                    <Key size={20} className={cn("transition-transform duration-300", !isManagedMode ? "scale-110" : "group-hover/btn:scale-110")} />
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold leading-tight">BYOK</span>
                        <span className={cn("text-[9px] font-medium opacity-60", !isManagedMode ? "text-zinc-900" : "text-zinc-500")}>
                            Your Own Keys
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}
