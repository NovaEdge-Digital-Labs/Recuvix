"use client";

import { useState, useRef } from "react";
import { Clock, Tag, Pencil } from "lucide-react";

interface OutlineHeaderProps {
    h1: string;
    focusKeyword: string;
    estimatedReadTime: number;
    contentStrategy: string;
    fromResearch?: boolean;
    onUpdateH1: (newH1: string) => void;
}

export function OutlineHeader({
    h1,
    focusKeyword,
    estimatedReadTime,
    contentStrategy,
    fromResearch,
    onUpdateH1,
}: OutlineHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(h1);
    const inputRef = useRef<HTMLInputElement>(null);

    const startEdit = () => {
        setEditValue(h1);
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        }, 10);
    };

    const commitEdit = () => {
        if (editValue.trim()) onUpdateH1(editValue.trim());
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditValue(h1);
        setIsEditing(false);
    };

    return (
        <div className="space-y-3">
            {/* Top label row */}
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em] text-accent uppercase">
                    Outline Preview
                </span>
                {fromResearch && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        From keyword research
                    </span>
                )}
            </div>

            {/* H1 editable */}
            <div className="group relative">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={e => {
                            if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
                            if (e.key === "Escape") cancelEdit();
                        }}
                        className="w-full text-[22px] font-bold font-heading text-foreground bg-transparent border-0 border-b-2 border-accent outline-none leading-tight pb-1"
                        maxLength={80}
                        aria-label="Edit blog title"
                    />
                ) : (
                    <button
                        onClick={startEdit}
                        className="text-left w-full text-[22px] font-bold font-heading text-foreground leading-tight hover:text-foreground/90 transition-colors cursor-text"
                        title="Click to edit title"
                    >
                        {h1}
                        <Pencil
                            size={14}
                            className="inline ml-2 opacity-0 group-hover:opacity-50 transition-opacity text-muted-foreground"
                        />
                    </button>
                )}
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
                {focusKeyword && (
                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        <Tag size={10} />
                        {focusKeyword}
                    </span>
                )}
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground border border-border">
                    <Clock size={10} />
                    ~{estimatedReadTime} min read
                </span>
            </div>

            {/* Content strategy */}
            {contentStrategy && (
                <p className="text-[13px] text-muted-foreground italic leading-relaxed">
                    <span className="not-italic text-[11px] uppercase tracking-wider text-muted-foreground/60 mr-1">Strategy:</span>
                    {contentStrategy}
                </p>
            )}
        </div>
    );
}
