import React from 'react';
import { Sparkles, Zap, Wand2, Eraser } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface CleaningModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (level: 'light' | 'standard' | 'heavy') => void;
}

export const CleaningModal: React.FC<CleaningModalProps> = ({ isOpen, onClose, onSelect }) => {
    const options = [
        {
            id: 'light',
            title: 'Light Clean',
            desc: 'Remove filler words (ums, uhs) and repetitions only.',
            icon: Eraser,
        },
        {
            id: 'standard',
            title: 'Standard',
            desc: 'Clean fillers + basic structuring into logical paragraphs.',
            icon: Wand2,
            recommended: true,
        },
        {
            id: 'heavy',
            title: 'Heavy Editorial',
            desc: 'Full cleanup of grammar, run-on sentences, and phrasing.',
            icon: Sparkles,
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#0d0d0d] border-white/10 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">AI Transcript Cleaning</DialogTitle>
                    <DialogDescription className="text-white/60">
                        Choose how thoroughly we should clean your spoken words.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex flex-col gap-3">
                    {options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id as any)}
                            className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 text-left hover:border-accent/40 hover:bg-accent/5 transition-all relative group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent/10">
                                <opt.icon className="w-5 h-5 text-white/40 group-hover:text-accent" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{opt.title}</p>
                                <p className="text-xs text-white/40">{opt.desc}</p>
                            </div>
                            {opt.recommended && (
                                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-tighter text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                                    Recommended
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-center text-white/20">
                    AI cleaning uses tokens from your connected LLM provider.
                </p>
            </DialogContent>
        </Dialog>
    );
};
