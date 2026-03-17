"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGenerationRouter } from "@/hooks/useGenerationRouter";
import { BlogFormData } from "@/components/form/BlogForm";
import { useAppContext } from "@/context/AppContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Terminal, CheckCircle2, XCircle, Search, PenTool, Image as ImageIcon, BarChart, Package, ChevronDown, ChevronRight, Zap } from "lucide-react";
import { NavBar } from "@/components/navigation/NavBar";

export default function GeneratingPage() {
    console.log("GeneratingPage render");
    const router = useRouter();
    const { generate, abort, status, streamedText, progress, error, isManaged, stepMessage } = useGenerationRouter();
    const { lastOutput, isHydrated } = useAppContext();
    const { activeWorkspace } = useWorkspace();
    const [hasStarted, setHasStarted] = useState(false);
    const hasStartedRef = useRef(false);
    const streamEndRef = useRef<HTMLDivElement>(null);
    const [outlineExpanded, setOutlineExpanded] = useState(false);
    const [approvedOutline, setApprovedOutline] = useState<{
        h1: string;
        h2s: Array<{ text: string } | string>;
    } | null>(null);

    // Capture approved outline from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            const stored = localStorage.getItem("recuvix_approved_outline");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.h1 && Array.isArray(parsed.h2s)) {
                    setApprovedOutline({ h1: parsed.h1, h2s: parsed.h2s });
                }
            }
        } catch { /* ignore */ }
    }, []);

    // Auto-scroll stream
    useEffect(() => {
        if (streamEndRef.current) {
            streamEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [streamedText]);

    useEffect(() => {
        if (typeof window === "undefined" || !isHydrated) return;
        if (hasStartedRef.current) return;

        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('source');

        if (source === 'voice') {
            const pendingVoiceStr = localStorage.getItem("pending_voice_generation");
            if (!pendingVoiceStr) {
                router.push("/");
                return;
            }
            try {
                const pendingVoice = JSON.parse(pendingVoiceStr);
                hasStartedRef.current = true;
                setHasStarted(true);
                generate(pendingVoice);

                setTimeout(() => {
                    localStorage.removeItem("pending_voice_generation");
                }, 1000);
            } catch (e) {
                console.error("Invalid voice task:", e);
                router.push("/");
            }
            return;
        }

        const pendingTaskStr = localStorage.getItem("recuvix_pending_task");
        if (!pendingTaskStr) {
            if (!hasStarted) {
                console.log("GeneratingPage: No pending task found, redirecting home");
                router.push("/");
            }
            return;
        }

        try {
            const pendingTask: BlogFormData = JSON.parse(pendingTaskStr);
            console.log("GeneratingPage: Starting generation for topic:", pendingTask.topic);

            hasStartedRef.current = true;
            setHasStarted(true);
            generate(pendingTask);

            // Clear it after a short delay to ensure it's picked up only once
            setTimeout(() => {
                localStorage.removeItem("recuvix_pending_task");
            }, 1000);
        } catch (e) {
            console.error("Invalid pending task:", e);
            router.push("/");
        }
    }, [hasStarted, isHydrated, router, generate]);

    if (!isHydrated) return <div className="min-h-screen bg-[#0a0a0a]" />;

    const stepsList: { id: string; label: string; icon: React.ReactNode }[] = [
        { id: "analyzing", label: "Analyzing intent & SERP...", icon: <Search size={16} /> },
        { id: "writing", label: "Writing optimized content...", icon: <PenTool size={16} /> },
        { id: "sourcing", label: "Sourcing & placing imagery...", icon: <ImageIcon size={16} /> },
        { id: "seo", label: "Generating thumbnail & SEO meta...", icon: <BarChart size={16} /> },
        { id: "packaging", label: "Packaging final files...", icon: <Package size={16} /> },
    ];

    const getStepStatus = (id: string) => {
        if (status === "error") return "error";
        if (status === "complete" || status === "done") return "done";

        // Map status to current step index
        const currentIndex = isManaged
            ? (status === "generating" ? (progress < 20 ? 0 : progress < 40 ? 1 : progress < 60 ? 2 : progress < 80 ? 3 : 4) : -1)
            : stepsList.findIndex((s) => s.id === status);

        const thisIndex = stepsList.findIndex((s) => s.id === id);

        if (thisIndex < currentIndex) return "done";
        if (thisIndex === currentIndex) return "active";
        return "pending";
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <NavBar />

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">

                {/* Left Column: Progress Timeline */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading text-xl font-bold">
                                {activeWorkspace ? `${activeWorkspace.name} Engine` : "Engine Activity"}
                            </h2>
                            {isManaged && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-full">
                                    <Zap className="w-3 h-3 text-accent" />
                                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Managed Mode</span>
                                </div>
                            )}
                        </div>

                        <Progress value={progress} className="h-2 mb-8 bg-background" />

                        {isManaged && stepMessage && (
                            <p className="text-xs text-zinc-500 font-mono mb-6 flex items-center gap-2">
                                <ChevronRight className="w-3 h-3 text-accent" />
                                {stepMessage}
                            </p>
                        )}

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                            {stepsList.map((s) => {
                                const stepStatus = getStepStatus(s.id);
                                return (
                                    <div key={s.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-background bg-card text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors z-10"
                                            style={{
                                                borderColor: stepStatus === "active" ? "hsl(var(--accent))" : stepStatus === "done" ? "hsl(var(--muted-foreground))" : "var(--background)",
                                                color: stepStatus === "active" ? "hsl(var(--accent))" : stepStatus === "done" ? "hsl(var(--foreground))" : "currentColor"
                                            }}
                                        >
                                            {stepStatus === "done" ? <CheckCircle2 size={16} /> : stepStatus === "active" ? <Loader2 size={16} className="animate-spin" /> : s.icon}
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border bg-background shadow-sm">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className={`font-bold text-sm ${stepStatus === "active" ? "text-accent" : stepStatus === "done" ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {error ? (
                            <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive">
                                <XCircle className="shrink-0 mt-0.5" size={18} />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        ) : null}

                        <div className="mt-8 pt-6 border-t border-border">
                            {status !== "complete" && status !== "done" && status !== "error" ? (
                                <Button variant="destructive" onClick={abort} className="w-full">
                                    Abort Generation
                                </Button>
                            ) : status === "error" ? (
                                <Button onClick={() => router.push("/")} className="w-full">
                                    Return to Dashboard
                                </Button>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Right Column: Streaming Terminal + Approved Outline */}
                <div className="w-full lg:w-2/3 flex flex-col gap-4">

                    {/* Approved outline collapsible reference */}
                    {approvedOutline && (
                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            <button
                                onClick={() => setOutlineExpanded(p => !p)}
                                className="w-full flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    {outlineExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    Writing from your approved outline
                                </span>
                                <span className="font-mono text-xs text-accent">{approvedOutline.h2s.length} sections</span>
                            </button>

                            {outlineExpanded && (
                                <div className="px-4 pb-4 space-y-2 border-t border-border animate-in slide-in-from-top-2 duration-200">
                                    <p className="text-sm font-bold text-foreground pt-3">{approvedOutline.h1}</p>
                                    <div className="space-y-1">
                                        {approvedOutline.h2s.map((h, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="font-mono text-[10px] text-muted-foreground/40 w-5 text-right">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                                <span>{typeof h === "string" ? h : h.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Streaming Terminal */}
                    <div className="flex-1 h-[600px] lg:h-[calc(100vh-8rem)] bg-[#0d0d0d] border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
                        <div className="h-12 bg-surface border-b border-border flex items-center px-4 gap-2 shrink-0">
                            <Terminal size={16} className="text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">recuvix-llm-stream.log</span>
                            {(status === "writing" || (isManaged && status === "generating")) && <Loader2 size={14} className="animate-spin text-accent ml-auto" />}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-[#00ff9d] opacity-90 custom-scrollbar">
                            {streamedText.split('\n').map((line, i) => (
                                <p key={i} className="min-h-[1.5em] break-words">{line}</p>
                            ))}
                            {(status === "writing" || (isManaged && status === "generating")) && (
                                <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-1 vertical-align-middle" />
                            )}
                            <div ref={streamEndRef} />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
