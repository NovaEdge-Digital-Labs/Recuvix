"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSectionParser } from "@/hooks/useSectionParser";
import { SectionActionsToolbar } from "./SectionActionsToolbar";
import { SectionRewritePopover } from "./SectionRewritePopover";
import { SectionStreamingView } from "./SectionStreamingView";
import { SectionAcceptBar } from "./SectionAcceptBar";
import { InlineEditToolbar } from "./InlineEditToolbar";
import { LANGUAGES } from "@/lib/config/languageConfig";

interface BlogPreviewProps {
    html: string;
    isEditMode: boolean;
    activeSectionIndex: number | null;
    activeSectionAction: string | null;
    sectionStreamText: string;
    onRewrite: (index: number, instruction: string) => void;
    onAccept: (index: number, html: string) => void;
    onDiscard: () => void;
    onManualSave: (index: number, html: string) => void;
    langCode?: string;
}

export function BlogPreview({
    html,
    isEditMode,
    activeSectionIndex,
    sectionStreamText,
    onRewrite,
    onAccept,
    onDiscard,
    onManualSave,
    langCode = "en"
}: BlogPreviewProps) {
    const { parseHtml } = useSectionParser();
    const [sections, setSections] = useState(parseHtml(html));
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedRewriteIndex, setSelectedRewriteIndex] = useState<number | null>(null);
    const [manualEditIndex, setManualEditIndex] = useState<number | null>(null);
    const [editableHtml, setEditableHtml] = useState("");

    useEffect(() => {
        setSections(parseHtml(html));
    }, [html, parseHtml]);

    const handleAction = useCallback((index: number, action: string) => {
        if (action === "rewrite") {
            setSelectedRewriteIndex(index);
        } else {
            onRewrite(index, action);
        }
    }, [onRewrite]);

    const startManualEdit = (index: number) => {
        setManualEditIndex(index);
        setEditableHtml(sections[index].fullSectionHtml);
    };

    const cancelManualEdit = () => {
        setManualEditIndex(null);
        setEditableHtml("");
    };

    const saveManualEdit = () => {
        if (manualEditIndex !== null) {
            onManualSave(manualEditIndex, editableHtml);
            setManualEditIndex(null);
            setEditableHtml("");
        }
    };

    const direction = LANGUAGES.find(l => l.code === langCode)?.direction || "ltr";
    const fontStack = LANGUAGES.find(l => l.code === langCode)?.fontStack || "inherit";

    return (
        <div
            className={cn(
                "prose prose-invert prose-p:text-[#e0e0e0] prose-headings:font-heading prose-headings:text-foreground prose-a:text-accent hover:prose-a:text-accent/80 max-w-none relative",
                direction === "rtl" ? "direction-rtl text-right" : "direction-ltr text-left"
            )}
            style={{ fontFamily: fontStack }}
        >
            {sections.map((section, index) => {
                const isActive = activeSectionIndex === index;
                const isSelectedForRewrite = selectedRewriteIndex === index;
                const isEditingManually = manualEditIndex === index;

                // If this section is being regenerated, show the streaming view
                if (isActive && sectionStreamText) {
                    return (
                        <div key={`stream-${index}`} className="my-10 relative">
                            <SectionStreamingView
                                html={sectionStreamText}
                                isStreaming={true}
                            />
                            <SectionAcceptBar
                                onAccept={() => onAccept(index, sectionStreamText)}
                                onDiscard={onDiscard}
                                isStreaming={false} // Allow accepting even while streaming if user wants
                            />
                        </div>
                    );
                }

                return (
                    <div
                        key={index}
                        className={cn(
                            "relative transition-all duration-300 rounded-xl",
                            isEditMode && "hover:bg-accent/[0.03] hover:ring-1 hover:ring-accent/20 cursor-default",
                            isEditMode && hoveredIndex === index && "relative z-10"
                        )}
                        onMouseEnter={() => isEditMode && setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Action Toolbar */}
                        {isEditMode && hoveredIndex === index && !isActive && !isEditingManually && (
                            <SectionActionsToolbar
                                isVisible={true}
                                onAction={(action) => handleAction(index, action)}
                            />
                        )}

                        {/* Rewrite Popover */}
                        {isSelectedForRewrite && (
                            <SectionRewritePopover
                                onRewrite={(instruction) => {
                                    onRewrite(index, instruction);
                                    setSelectedRewriteIndex(null);
                                }}
                                onClose={() => setSelectedRewriteIndex(null)}
                            />
                        )}

                        {/* Manual Edit Toolbar */}
                        {isEditingManually && (
                            <InlineEditToolbar
                                onSave={saveManualEdit}
                                onCancel={cancelManualEdit}
                                className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
                            />
                        )}

                        {/* Section Content */}
                        {isEditingManually ? (
                            <div className="p-4 md:p-6 rounded-lg border transition-all bg-surface border-accent shadow-2xl z-20">
                                <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => setEditableHtml(e.currentTarget.innerHTML)}
                                    className="outline-none focus:outline-none min-h-[100px]"
                                    dangerouslySetInnerHTML={{ __html: editableHtml }}
                                />
                            </div>
                        ) : (
                            <div
                                className="p-4 md:p-6 rounded-lg border border-transparent transition-all"
                                onClick={() => isEditMode && startManualEdit(index)}
                                dangerouslySetInnerHTML={{ __html: section.fullSectionHtml }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
