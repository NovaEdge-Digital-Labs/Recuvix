import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Zap, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BulkTopic } from "@/lib/validators/bulkSchemas";
import { BulkOptions } from "@/hooks/useBulkGeneration";
import { cn } from "@/lib/utils";

interface BulkGenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCount: number;
    isRunning: boolean;
    queue: BulkTopic[];
    completedCount: number;
    failedCount: number;
    currentIndex: number;
    onStart: (options: BulkOptions) => void;
    onCancel: () => void;
    onDownload: () => void;
}

export function BulkGenerateModal(props: BulkGenerateModalProps) {
    const {
        isOpen, onClose, selectedCount, isRunning, queue,
        completedCount, failedCount, currentIndex,
        onStart, onCancel, onDownload
    } = props;

    const [options, setOptions] = useState<BulkOptions>({
        format: "markdown",
        wordCount: 1500,
        tone: "Professional & Authoritative"
    });

    const isComplete = !isRunning && (queue?.length ?? 0) > 0 && (completedCount + failedCount === (queue?.length ?? 0));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isRunning && !open && onClose()}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black flex items-center gap-2">
                        <Zap size={20} className="text-accent fill-current" />
                        Bulk Generation Pipeline
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isRunning
                            ? "Generating your high-authority blog posts one by one..."
                            : `Configure generation settings for ${selectedCount} selected topics.`
                        }
                    </DialogDescription>
                </DialogHeader>

                {!isRunning && !isComplete ? (
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Output Tone</Label>
                            <Select
                                value={options.tone}
                                onValueChange={(v) => setOptions((prev: BulkOptions) => ({ ...prev, tone: v as string }))}
                            >
                                <SelectTrigger className="bg-background border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-border">
                                    <SelectItem value="Professional & Authoritative">Professional & Authoritative</SelectItem>
                                    <SelectItem value="Conversational & Engaging">Conversational & Engaging</SelectItem>
                                    <SelectItem value="Witty & Humorous">Witty & Humorous</SelectItem>
                                    <SelectItem value="Data-Driven & Analytical">Data-Driven & Analytical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Approx. Word Count</Label>
                            <Input
                                type="number"
                                value={options.wordCount}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOptions((prev: BulkOptions) => ({ ...prev, wordCount: parseInt(e.target.value) }))}
                                className="bg-background border-border"
                            />
                        </div>

                        <div className="p-4 bg-accent/5 rounded-xl border border-accent/10">
                            <p className="text-xs text-accent/80 leading-relaxed font-medium">
                                NOTE: Sequential generation respects rate limits. Estimated time for {selectedCount} topics: ~{selectedCount * 2} minutes.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="py-6 space-y-6">
                        {/* Progress Indicator */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                <span className="text-muted-foreground">Overall Progress</span>
                                <span className="text-accent">{Math.round(((completedCount + failedCount) / (queue?.length || 1)) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent transition-all duration-500"
                                    style={{ width: `${((completedCount + failedCount) / (queue?.length || 1)) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Queue Status */}
                        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {queue?.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-lg border text-sm transition-all",
                                        i === currentIndex ? "bg-accent/10 border-accent/30" : "bg-background border-border/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3 truncate">
                                        {item.status === "complete" ? (
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                        ) : item.status === "failed" ? (
                                            <AlertCircle size={16} className="text-destructive shrink-0" />
                                        ) : item.status === "generating" ? (
                                            <Loader2 size={16} className="text-accent animate-spin shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                                        )}
                                        <span className={cn(
                                            "truncate font-medium",
                                            item.status === "complete" ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {item.topic}
                                        </span>
                                    </div>
                                    {item.status === "complete" && (
                                        <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded font-bold uppercase">
                                            Done
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {!isRunning && !isComplete ? (
                        <>
                            <Button variant="outline" onClick={onClose} className="border-border">Cancel</Button>
                            <Button
                                onClick={() => onStart(options)}
                                className="bg-accent text-black font-black hover:bg-accent/90"
                            >
                                Start Pipeline
                            </Button>
                        </>
                    ) : isRunning ? (
                        <Button variant="destructive" onClick={onCancel} className="w-full">
                            Cancel Generation
                        </Button>
                    ) : (
                        <div className="flex w-full gap-2">
                            <Button variant="outline" onClick={onClose} className="flex-1 border-border">Close</Button>
                            <Button onClick={onDownload} className="flex-1 bg-green-600 text-white hover:bg-green-700 font-bold">
                                <Download size={16} className="mr-2" />
                                Download ZIP
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
