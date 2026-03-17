"use client";

import { RefreshCcw, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SEORegenBannerProps {
    onUpdate: () => void;
    onDismiss: () => void;
    isLoading?: boolean;
}

export function SEORegenBanner({ onUpdate, onDismiss, isLoading }: SEORegenBannerProps) {
    return (
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <RefreshCcw size={18} className="text-accent" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-foreground">Blog changed significantly — update SEO pack?</h4>
                    <p className="text-xs text-muted-foreground">Focus keyword and meta description may need updating to reflect your edits.</p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onDismiss}
                    className="text-xs border-border hover:bg-surface"
                >
                    <X size={14} className="mr-1" />
                    Dismiss
                </Button>
                <Button
                    size="sm"
                    onClick={onUpdate}
                    disabled={isLoading}
                    className="text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
                >
                    {isLoading ? <Loader2 size={14} className="mr-1 animate-spin" /> : null}
                    {isLoading ? "Updating..." : "Update SEO Pack"}
                </Button>
            </div>
        </div>
    );
}
