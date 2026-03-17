"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface WordCountBadgeProps {
    count: number;
}

export function WordCountBadge({ count }: WordCountBadgeProps) {
    const [prevCount, setPrevCount] = useState(count);
    const [status, setStatus] = useState<"increased" | "decreased" | "neutral">("neutral");

    useEffect(() => {
        if (count > prevCount) {
            setStatus("increased");
            setTimeout(() => setStatus("neutral"), 2000);
        } else if (count < prevCount) {
            setStatus("decreased");
            setTimeout(() => setStatus("neutral"), 2000);
        }
        setPrevCount(count);
    }, [count, prevCount]);

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition-all duration-500",
            status === "increased" && "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]",
            status === "decreased" && "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
            status === "neutral" && "bg-surface border-border text-muted-foreground"
        )}>
            <FileText size={13} />
            <span>{count.toLocaleString()} words</span>
        </div>
    );
}
