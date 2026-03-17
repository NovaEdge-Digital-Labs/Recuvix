"use client";

import { Button } from "@/components/ui/button";
import { Globe, LogOut, CheckCircle2 } from "lucide-react";

interface GscStatusBarProps {
    siteUrl: string;
    onDisconnect: () => void;
}

export function GscStatusBar({ siteUrl, onDisconnect }: GscStatusBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 bg-muted/20 hover:bg-muted/30 transition-colors px-5 py-2.5 rounded-2xl border border-border/50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shadow-inner">
                    <Globe className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">GSC Connected</span>
                    <span className="text-sm font-semibold leading-tight max-w-[220px] truncate">{siteUrl}</span>
                </div>
            </div>

            <div className="h-6 w-px bg-border/60 hidden sm:block mx-1"></div>

            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active</span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDisconnect}
                    className="h-8 px-3 text-[11px] font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                >
                    <LogOut className="w-3.5 h-3.5 mr-1.5" />
                    Disconnect
                </Button>
            </div>
        </div>
    );
}
