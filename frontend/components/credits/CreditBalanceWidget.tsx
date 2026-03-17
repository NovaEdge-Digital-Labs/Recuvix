"use client";

import { useCredits } from "@/hooks/useCredits";
import { Coins, Plus } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CreditBalanceWidget() {
    const { balance, isLoading, isManagedMode } = useCredits();

    if (isLoading) {
        return <Skeleton className="h-8 w-24 rounded-full" />;
    }

    return (
        <Link
            href="/pricing"
            className={cn(
                "group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
                isManagedMode
                    ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 shadow-[0_0_15px_rgba(232,255,71,0.1)]"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            )}
            title={isManagedMode ? "Managed Mode Active" : "BYOK Mode Active"}
        >
            <Coins size={14} className={cn(isManagedMode ? "text-accent" : "text-zinc-500")} />
            <span className="text-xs font-bold leading-none">
                {balance ?? 0}
            </span>
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-accent text-zinc-950 group-hover:scale-110 transition-transform">
                <Plus size={10} strokeWidth={3} />
            </div>
        </Link>
    );
}
