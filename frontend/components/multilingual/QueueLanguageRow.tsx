import React from "react";
import { Check, Loader2, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageQueueItem } from "@/hooks/useMultilingualGeneration";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QueueLanguageRowProps {
    item: LanguageQueueItem;
    isActive: boolean;
    onView: (code: string) => void;
    onRetry: (code: string) => void;
}

export function QueueLanguageRow({ item, isActive, onView, onRetry }: QueueLanguageRowProps) {
    const { language, status, error, wordCount, progress } = item;

    return (
        <div className={cn(
            "group relative flex flex-col p-4 border-b last:border-b-0 transition-all",
            isActive ? "bg-primary/5" : "bg-transparent",
            status === "failed" ? "bg-destructive/5" : ""
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="text-2xl">{language.flag}</span>
                        {status === "generating" && (
                            <div className="absolute -bottom-1 -right-1">
                                <div className="w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-background" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none">{language.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-1">
                            {status === "queued" ? "Waiting in queue..." :
                                status === "generating" ? "Generating localized content..." :
                                    status === "complete" ? `${wordCount} words generated` :
                                        "Generation failed"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {status === "complete" ? (
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-1 rounded-full">
                                <Check className="w-4 h-4" />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[10px] uppercase font-bold tracking-tighter"
                                onClick={() => onView(language.code)}
                            >
                                View
                            </Button>
                        </div>
                    ) : status === "generating" ? (
                        <div className="flex items-center gap-2 text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-[10px] font-bold uppercase">Writing...</span>
                        </div>
                    ) : status === "failed" ? (
                        <div className="flex items-center gap-2 text-destructive">
                            <X className="w-4 h-4" />
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] uppercase font-bold border-destructive/20 hover:bg-destructive/10 text-destructive"
                                onClick={() => onRetry(language.code)}
                            >
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground/40">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase">Queued</span>
                        </div>
                    )}
                </div>
            </div>

            {status === "generating" && (
                <div className="space-y-1 mt-1">
                    <Progress value={progress} className="h-1" />
                    <p className="text-[9px] text-muted-foreground italic text-right">
                        Approx. {Math.round(progress)}% complete
                    </p>
                </div>
            )}

            {status === "failed" && error && (
                <p className="text-[10px] text-destructive font-medium mt-1 pl-9">
                    Error: {error}
                </p>
            )}

            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}
        </div>
    );
}
