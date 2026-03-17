import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplyLinksBarProps {
    approvedCount: number;
    onApply: () => void;
    onCancel: () => void;
    isApplying: boolean;
}

export function ApplyLinksBar({ approvedCount, onApply, onCancel, isApplying }: ApplyLinksBarProps) {
    return (
        <AnimatePresence>
            {approvedCount > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
                >
                    <div className="bg-zinc-900 border border-accent/20 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-6 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                                <Sparkles className="h-5 w-5 text-accent" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-zinc-100">
                                    {approvedCount} Link{approvedCount !== 1 ? 's' : ''} Approved
                                </p>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                                    <Info className="h-3 w-3" />
                                    <span>Ready to inject into blog HTML</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-zinc-400 hover:text-zinc-200"
                                onClick={onCancel}
                                disabled={isApplying}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-accent text-zinc-950 hover:bg-accent/90 font-bold px-6 h-9"
                                onClick={onApply}
                                disabled={isApplying}
                            >
                                {isApplying ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                        <span>Applying...</span>
                                    </div>
                                ) : (
                                    `Apply to Blog`
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
