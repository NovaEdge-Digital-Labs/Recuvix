import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { XCircle, Timer, AlertCircle } from "lucide-react";
import { LanguageQueueItem } from "@/hooks/useMultilingualGeneration";
import { QueueLanguageRow } from "./QueueLanguageRow";

interface GenerationQueueProps {
    queue: LanguageQueueItem[];
    activeLanguage: string | null;
    completedCount: number;
    totalCount: number;
    isRunning: boolean;
    onCancel: () => void;
    onView: (code: string) => void;
    onRetry: (code: string) => void;
}

export function GenerationQueue({
    queue,
    activeLanguage,
    completedCount,
    totalCount,
    isRunning,
    onCancel,
    onView,
    onRetry,
}: GenerationQueueProps) {
    const overallProgress = (completedCount / totalCount) * 100;
    const estimatedTimeRemaining = isRunning ? (totalCount - completedCount) * 35 : 0;

    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">Generation Queue</h2>
                        <p className="text-xs text-muted-foreground font-medium">
                            {completedCount} of {totalCount} versions complete
                        </p>
                    </div>
                    {isRunning && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive hover:border-destructive/30"
                            onClick={onCancel}
                        >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Cancel All
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    <Progress value={overallProgress} className="h-1.5" />
                    {isRunning && (
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">
                            <div className="flex items-center gap-1.5 text-primary">
                                <Timer className="w-3 h-3" />
                                <span>~{estimatedTimeRemaining}s remaining</span>
                            </div>
                            <span>{Math.round(overallProgress)}% Total Progress</span>
                        </div>
                    )}
                </div>

                {/* Generation Mode Toggle (Visual Only for now) */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Generation Mode</span>
                        <span className="text-[9px] text-muted-foreground italic">Sequential recommended</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-muted/30 p-1.5 rounded-lg border border-muted/50">
                        <Label htmlFor="parallel-mode" className="text-[9px] font-bold uppercase tracking-tighter cursor-not-allowed opacity-40">Parallel</Label>
                        <Switch id="parallel-mode" disabled />
                    </div>
                </div>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto max-h-[500px] scrollbar-hide">
                {queue.map((item) => (
                    <QueueLanguageRow
                        key={item.language.code}
                        item={item}
                        isActive={activeLanguage === item.language.code}
                        onView={onView}
                        onRetry={onRetry}
                    />
                ))}
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-muted/20 border-t">
                <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                    <p className="text-[9px] text-muted-foreground leading-normal">
                        Each version is natively localized for SEO using deep market context.
                        Do not close this tab until all generations are complete.
                    </p>
                </div>
            </div>
        </div>
    );
}
