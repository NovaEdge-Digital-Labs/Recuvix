import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthHeaderProps {
    title: string;
    className?: string;
}

export function AuthHeader({ title, className }: AuthHeaderProps) {
    return (
        <div className={cn("text-center mb-8", className)}>
            <div className="inline-block mb-6 select-none">
                <span className="font-syne font-bold text-2xl tracking-tighter">
                    <span className="text-accent">RECU</span>
                    <span className="text-white">VIX</span>
                </span>
            </div>
            <h1 className="font-syne text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                {title}
            </h1>
        </div>
    );
}
