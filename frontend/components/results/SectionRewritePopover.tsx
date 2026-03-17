"use client";

import { useState } from "react";
import {
    Wand2,
    Send,
    Sparkles,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SectionRewritePopoverProps {
    onRewrite: (instruction: string) => void;
    onClose: () => void;
}

export function SectionRewritePopover({ onRewrite, onClose }: SectionRewritePopoverProps) {
    const [instruction, setInstruction] = useState("");

    const suggestedPrompts = [
        "Make it more educational",
        "Add more industry jargon",
        "Focus on beginner audience",
        "Rewrite for expert level",
        "Make it more persuasive",
    ];

    const handleSubmit = () => {
        if (instruction.trim()) {
            onRewrite(instruction);
        }
    };

    return (
        <div className="absolute -top-[230px] left-1/2 -translate-x-1/2 w-[320px] bg-surface-lighter border border-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Wand2 size={14} className="text-accent" />
                    <span className="text-xs font-bold text-foreground">AI Section Rewrite</span>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                    <X size={14} />
                </Button>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <Textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="Tell the AI how to rewrite this section..."
                        className="text-xs min-h-[80px] bg-surface border-border focus:border-accent resize-none pr-8"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!instruction.trim()}
                        className="absolute bottom-2 right-2 p-1.5 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={14} />
                    </button>
                </div>

                <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Sparkles size={10} />
                        Quick suggestions
                    </span>
                    <div className="flex flex-wrap gap-1">
                        {suggestedPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                onClick={() => setInstruction(prompt)}
                                className="text-[9px] px-2 py-1 rounded-full bg-surface border border-border hover:border-accent/30 hover:bg-accent/5 transition-all text-muted-foreground hover:text-foreground"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
