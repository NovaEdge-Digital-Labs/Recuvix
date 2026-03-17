"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { OutlineResponse, ApprovedOutline } from "@/lib/types/outline";
import { toast } from "sonner";
import { OutlineHeader } from "./OutlineHeader";
import { OutlineH2List } from "./OutlineH2List";
import { OutlineRegenerateBar } from "./OutlineRegenerateBar";
import { OutlineHistoryNav } from "./OutlineHistoryNav";
import { OutlineFooter } from "./OutlineFooter";
import { OutlineSkeletonLoader } from "./OutlineSkeletonLoader";
import { cn } from "@/lib/utils";

interface OutlinePreviewPanelProps {
    outline: OutlineResponse | null;
    generationInput: { wordCount: number;[key: string]: unknown };
    isVisible: boolean;
    isLoading: boolean;
    historyLength: number;
    historyIndex: number;
    regenerationError: string | null;
    fromResearch?: boolean;
    onConfirm: (approvedOutline: ApprovedOutline) => void;
    onRegenerate: (note: string) => void;
    onClose: () => void;
    onUpdateH1: (h1: string) => void;
    onUpdateH2: (id: string, text: string) => void;
    onAddH2: () => string | void;
    onRemoveH2: (id: string) => void;
    onRestoreH2: () => void;
    onReorderH2s: (newOrder: string[]) => void;
    onNavigateHistory: (dir: "back" | "forward") => void;
    approveOutline: () => ApprovedOutline;
}

export function OutlinePreviewPanel({
    outline,
    generationInput,
    isVisible,
    isLoading,
    historyLength,
    historyIndex,
    regenerationError,
    fromResearch,
    onConfirm,
    onRegenerate,
    onClose,
    onUpdateH1,
    onUpdateH2,
    onAddH2,
    onRemoveH2,
    onRestoreH2,
    onReorderH2s,
    onNavigateHistory,
    approveOutline,
}: OutlinePreviewPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [newItemId, setNewItemId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Animate in
    useEffect(() => {
        if (isVisible) {
            requestAnimationFrame(() => setMounted(true));
        } else {
            setMounted(false);
        }
    }, [isVisible]);

    // Focus trap
    useEffect(() => {
        if (!isVisible) return;
        const panel = panelRef.current;
        if (!panel) return;

        const focusable = panel.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") { onClose(); return; }
            if (e.key !== "Tab") return;
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
            }
        };

        document.addEventListener("keydown", handler);
        // Initial focus
        setTimeout(() => closeButtonRef.current?.focus(), 50);
        return () => document.removeEventListener("keydown", handler);
    }, [isVisible, onClose]);

    // Handle add new H2
    const handleAdd = useCallback(() => {
        const id = onAddH2();
        if (typeof id === "string") {
            setNewItemId(id);
            setTimeout(() => setNewItemId(null), 2000);
        }
    }, [onAddH2]);

    // Handle remove with undo
    const handleRemove = useCallback((id: string) => {
        onRemoveH2(id);
        toast.success("Section removed", {
            action: {
                label: "Undo",
                onClick: () => onRestoreH2(),
            },
        });
    }, [onRemoveH2, onRestoreH2]);

    // Handle confirm
    const handleConfirm = useCallback(() => {
        const approved = approveOutline();
        onConfirm(approved);
    }, [approveOutline, onConfirm]);

    if (!isVisible) return null;

    const skeletonRowCount = generationInput.wordCount < 800 ? 4 : generationInput.wordCount < 1500 ? 6 : 8;

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 transition-opacity duration-200",
                    "bg-black/75 backdrop-blur-[4px]",
                    mounted ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel — desktop: centered modal, mobile: bottom sheet */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Blog Outline Preview"
                className={cn(
                    "fixed z-50 bg-[#0f0f0f] border border-[#2a2a2a] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col",
                    // Desktop
                    "lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-full lg:max-w-[680px] lg:max-h-[85vh] lg:rounded-2xl",
                    // Mobile
                    "bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[20px] lg:bottom-auto lg:left-auto lg:right-auto",
                    // Animation
                    "transition-all duration-300",
                    mounted
                        ? "opacity-100 lg:scale-100 translate-y-0"
                        : "opacity-0 lg:scale-95 translate-y-full lg:translate-y-0"
                )}
            >
                {/* Mobile handle */}
                <div className="lg:hidden flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-[#333]" />
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-4">
                    {/* Header row with close button */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {isLoading ? (
                                <OutlineSkeletonLoader rowCount={skeletonRowCount} />
                            ) : outline ? (
                                <OutlineHeader
                                    h1={outline.h1}
                                    focusKeyword={outline.focusKeyword}
                                    estimatedReadTime={outline.estimatedReadTime}
                                    contentStrategy={outline.contentStrategy}
                                    fromResearch={fromResearch}
                                    onUpdateH1={onUpdateH1}
                                />
                            ) : null}
                        </div>
                        <button
                            ref={closeButtonRef}
                            onClick={onClose}
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                            aria-label="Close outline preview"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#1a1a1a]" />

                    {/* H2 list */}
                    {!isLoading && outline && (
                        <OutlineH2List
                            h2s={outline.h2s}
                            wordCount={generationInput.wordCount}
                            newItemId={newItemId}
                            onUpdate={onUpdateH2}
                            onRemove={handleRemove}
                            onReorder={onReorderH2s}
                            onAdd={handleAdd}
                        />
                    )}
                    {isLoading && (
                        <div className="space-y-1">
                            <OutlineSkeletonLoader rowCount={skeletonRowCount} />
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-[#1a1a1a]" />

                    {/* Regenerate */}
                    <OutlineRegenerateBar
                        isRegenerating={isLoading}
                        hasHistory={historyLength > 0}
                        regenerationError={regenerationError}
                        onRegenerate={onRegenerate}
                    />

                    {/* History nav (shown after first regen) */}
                    {historyLength > 0 && (
                        <OutlineHistoryNav
                            currentIndex={historyIndex}
                            totalVersions={historyLength}
                            onNavigate={onNavigateHistory}
                        />
                    )}
                </div>

                {/* Sticky footer */}
                <div className="shrink-0 border-t border-[#1a1a1a] bg-[#0f0f0f] px-6 py-4">
                    {outline && (
                        <OutlineFooter
                            wordCount={generationInput.wordCount}
                            h2Count={outline.h2s.length}
                            focusKeyword={outline.focusKeyword}
                            fromResearch={Boolean(fromResearch)}
                            onConfirm={handleConfirm}
                            onClose={onClose}
                            approveOutline={approveOutline}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
