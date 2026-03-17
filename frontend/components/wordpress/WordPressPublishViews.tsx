import React from "react";
import { CheckCircle2, ExternalLink, Edit3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepStatus, WPPublishResult } from "@/lib/wordpress/wpTypes";

// --- Progress Component ---
export function WordPressPublishProgress({ steps }: { steps: StepStatus[] }) {
    return (
        <div className="space-y-4 py-4">
            {steps.map((step) => (
                <div key={step.step} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                        {step.status === "loading" ? (
                            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        ) : step.status === "done" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : step.status === "failed" ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : step.status === "skipped" ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/10" />
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-white/5 bg-white/5" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className={`text-sm font-medium ${step.status === "loading" ? "text-white" :
                            step.status === "done" ? "text-white/80" :
                                "text-white/40"
                            }`}>
                            {step.label}
                            {step.status === "loading" && <span className="ml-2 inline-block animate-pulse">...</span>}
                            {step.status === "skipped" && <span className="ml-2 text-[10px] uppercase font-bold text-white/20">(Skipped)</span>}
                        </div>
                        {step.error && (
                            <p className="text-[10px] text-red-400 mt-1 leading-tight">{step.error}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Success View ---
export function WordPressPublishSuccess({ result }: { result: WPPublishResult }) {
    return (
        <div className="text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Published Successfully!</h3>
            <p className="text-sm text-white/50 mb-8 max-w-sm mx-auto">
                Your blog post &quot;{result.title}&quot; is now available on your WordPress site.
            </p>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:border-accent/40 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${result.status === "publish" ? "bg-green-500/20 text-green-500" : "bg-white/10 text-white/60"
                            }`}>
                            {result.status === "publish" ? "Live" : "Draft"}
                        </div>
                    </div>
                    <h4 className="font-bold text-white mb-6 line-clamp-2 min-h-[3rem]">{result.title}</h4>
                    <Button
                        className="w-full bg-accent hover:bg-accent-hover text-white flex items-center gap-2 font-bold"
                        onClick={() => window.open(result.postUrl, "_blank")}
                    >
                        View Post <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:border-white/20 transition-all group">
                    <div className="text-white/30 mb-4">
                        <Edit3 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-white mb-6">Admin Panel</h4>
                    <Button
                        variant="outline"
                        className="w-full border-white/10 hover:bg-white/5 text-white flex items-center gap-2 font-bold"
                        onClick={() => window.open(result.postEditUrl, "_blank")}
                    >
                        Edit in WordPress <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {result.warning && (
                <div className="mt-8 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
                    <p className="text-xs text-yellow-500/70 italic leading-relaxed">
                        {result.warning}
                    </p>
                </div>
            )}
        </div>
    );
}

// --- Error View ---
export function WordPressPublishError({ error, onRetry }: { error: string, onRetry: () => void }) {
    return (
        <div className="text-center py-10">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">Publishing Failed</h3>
            <p className="text-sm text-red-400/70 mb-8 max-w-sm mx-auto">
                {error}
            </p>

            <Button
                onClick={onRetry}
                className="bg-white/10 hover:bg-white/20 text-white px-8 h-12 rounded-xl font-bold transition-all"
            >
                Try Again
            </Button>
        </div>
    );
}
