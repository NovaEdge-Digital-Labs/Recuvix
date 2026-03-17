"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCcw, Sparkles, Layout, MessageSquare } from "lucide-react";

interface RegenerateBlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (params: { instruction: string; keepStructure: boolean }) => void;
}

export function RegenerateBlogModal({ isOpen, onClose, onConfirm }: RegenerateBlogModalProps) {
    const [instruction, setInstruction] = useState("");
    const [keepStructure, setKeepStructure] = useState(true);

    const handleConfirm = () => {
        if (instruction.trim()) {
            onConfirm({ instruction, keepStructure });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-surface-lighter border-border p-0 gap-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent" />

                <div className="p-6">
                    <DialogHeader>
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                            <RefreshCcw size={24} className="text-accent" />
                        </div>
                        <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
                            Regenerate Full Blog
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Tell the AI what needs to change. The entire blog will be rewritten based on your feedback.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-3 font-medium">
                            <div className="flex items-center gap-2 text-xs text-foreground uppercase tracking-wider opacity-70">
                                <MessageSquare size={14} />
                                Your Instructions
                            </div>
                            <Textarea
                                placeholder="Example: 'Make the tone more aggressive', 'Add a section about future trends', 'Rewrite for a UK audience'..."
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                className="min-h-[120px] bg-surface border-border focus:border-accent resize-none text-sm placeholder:text-muted-foreground/50"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/50">
                            <div className="space-y-0.5">
                                <Label htmlFor="keep-structure" className="text-sm font-bold flex items-center gap-2">
                                    <Layout size={14} className="text-accent" />
                                    Preserve H2 Structure
                                </Label>
                                <p className="text-[10px] text-muted-foreground">Keep the existing headings and outline.</p>
                            </div>
                            <Switch
                                id="keep-structure"
                                checked={keepStructure}
                                onCheckedChange={setKeepStructure}
                                className="data-[state=checked]:bg-accent"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-surface border-t border-border flex sm:justify-between items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Sparkles size={12} className="text-accent" />
                        Uses your configured LLM API
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none text-xs">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!instruction.trim()}
                            className="flex-1 sm:flex-none text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-bold px-6"
                        >
                            Start Regeneration
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
