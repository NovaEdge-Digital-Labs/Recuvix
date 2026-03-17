"use client";

import { useCredits } from "@/hooks/useCredits";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Coins, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CreditDeductionWarning() {
    const { isManagedMode, balance, isLoading } = useCredits();

    if (isLoading || !isManagedMode) return null;

    const isLowBalance = (balance ?? 0) < 3;
    const hasNoCredits = (balance ?? 0) === 0;

    if (hasNoCredits) {
        return (
            <Alert variant="destructive" className="bg-red-950/20 border-red-900/50 text-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="font-bold">No Credits Remaining</AlertTitle>
                <AlertDescription className="text-red-300/80">
                    You need at least 1 credit to generate in Managed Mode.
                    <Link href="/pricing" className="ml-1 font-bold underline text-red-100 hover:text-white">Buy credits</Link> or switch to BYOK.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert className={cn(
            "backdrop-blur-sm transition-all",
            isLowBalance
                ? "bg-amber-950/20 border-amber-900/50 text-amber-200"
                : "bg-zinc-900/50 border-zinc-800 text-zinc-200"
        )}>
            <Coins className={isLowBalance ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-accent"} />
            <AlertTitle className={cn(
                "font-bold",
                isLowBalance ? "text-amber-100" : "text-zinc-100"
            )}>
                {isLowBalance ? "Low Credit Balance" : "Managed Mode Active"}
            </AlertTitle>
            <AlertDescription className={isLowBalance ? "text-amber-200/70" : "text-zinc-400"}>
                1 credit will be deducted upon generation. You currently have <b className="text-accent">{balance}</b> credits.
            </AlertDescription>
        </Alert>
    );
}
