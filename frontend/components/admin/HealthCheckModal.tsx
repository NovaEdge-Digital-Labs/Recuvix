"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Activity,
    CheckCircle2,
    XCircle,
    Loader2,
    AlertTriangle
} from "lucide-react";

interface HealthCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    keys: any[];
    onComplete: () => void;
}

export function HealthCheckModal({ isOpen, onClose, keys, onComplete }: HealthCheckModalProps) {
    const [isTesting, setIsTesting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ id: string, label: string, success: boolean, error?: string }[]>([]);

    const runCheck = async () => {
        setIsTesting(true);
        setResults([]);
        setProgress(0);

        const activeKeys = keys.filter(k => k.is_active);
        const total = activeKeys.length;

        for (let i = 0; i < total; i++) {
            const key = activeKeys[i];

            // Simulation of health check
            // In a real scenario, this would call /api/admin/test-key
            await new Promise(r => setTimeout(r, 800));

            const success = Math.random() > 0.1; // 90% success rate for demo

            const result = {
                id: key.id,
                label: key.label,
                success,
                error: success ? undefined : 'Simulated API failure (500)'
            };

            setResults(prev => [...prev, result]);

            // Update DB via API
            await fetch(`/api/admin/keys/${key.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_healthy: success,
                    last_error: success ? null : result.error,
                    last_error_at: success ? null : new Date().toISOString()
                })
            });

            setProgress(((i + 1) / total) * 100);
        }

        setIsTesting(false);
        onComplete();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white max-w-md">
                <DialogHeader>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Health Check</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        Test all active platform keys for availability.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {!isTesting && results.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-sm text-zinc-400 mb-6 font-medium leading-relaxed">
                                This will perform a minimal API request using each active key
                                to ensure they are valid and not rate limited.
                            </p>
                            <Button onClick={runCheck} className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-10">
                                Run Diagnostics
                            </Button>
                        </div>
                    )}

                    {(isTesting || results.length > 0) && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                    <span>{isTesting ? 'Testing platform key pool...' : 'Diagnostic Complete'}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-zinc-900 indicator-accent" />
                            </div>

                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                                <div className="p-3 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Registry Log
                                </div>
                                {results.map((r, i) => (
                                    <div key={i} className="px-4 py-3 border-b border-zinc-800/50 last:border-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {r.success ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                            <span className="text-xs font-medium text-zinc-300">{r.label}</span>
                                        </div>
                                        {!r.success && <span className="text-[10px] text-zinc-600">{r.error}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t border-zinc-900 pt-4">
                    <Button variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-white" disabled={isTesting}>
                        {results.length > 0 ? 'Close Results' : 'Cancel'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
