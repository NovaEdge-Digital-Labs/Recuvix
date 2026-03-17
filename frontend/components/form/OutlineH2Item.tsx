"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, X, Lock } from "lucide-react";
import { H2Item } from "@/lib/types/outline";
import { cn } from "@/lib/utils";

interface OutlineH2ItemProps {
    item: H2Item;
    index: number;
    isNew?: boolean;
    onUpdate: (id: string, text: string) => void;
    onRemove: (id: string) => void;
}

export function OutlineH2Item({ item, index, isNew, onUpdate, onRemove }: OutlineH2ItemProps) {
    const [isEditing, setIsEditing] = useState(isNew || false);
    const [editValue, setEditValue] = useState(item.text);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        if (isEditing) {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 10);
        }
    }, [isEditing]);

    const commitEdit = () => {
        const trimmed = editValue.trim();
        if (trimmed) onUpdate(item.id, trimmed);
        else setEditValue(item.text);
        setIsEditing(false);
    };

    const cancelEdit = () => {
        setEditValue(item.text);
        setIsEditing(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group flex items-center gap-3 p-3 rounded-lg border transition-all duration-150",
                item.locked
                    ? "border-accent/30 bg-accent/[0.03] border-l-2 border-l-accent"
                    : "border-transparent hover:bg-white/[0.03] hover:border-border",
                isDragging && "opacity-50 scale-[1.02] shadow-lg border-accent/40 bg-[#1a1a1a]"
            )}
        >
            {/* Drag handle */}
            <button
                {...attributes}
                {...listeners}
                className="opacity-40 group-hover:opacity-80 transition-opacity cursor-grab active:cursor-grabbing shrink-0 touch-none"
                aria-label="Drag to reorder section"
            >
                <GripVertical size={16} className="text-muted-foreground" />
            </button>

            {/* Number */}
            <span className="font-mono text-[13px] text-muted-foreground/60 shrink-0 w-6 text-right">
                {String(index + 1).padStart(2, "0")}
            </span>

            {/* Text / Edit mode */}
            <div className="flex-1 min-w-0">
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
                        placeholder="Enter section title..."
                        className="w-full text-sm text-foreground bg-transparent border-0 border-b border-accent outline-none pb-0.5"
                        aria-label={`Editing section ${index + 1}`}
                    />
                ) : (
                    <span className="text-sm text-foreground leading-snug flex items-center gap-1.5">
                        {item.text || <span className="text-muted-foreground italic">Empty section</span>}
                        {item.locked && (
                            <Lock size={11} className="text-accent shrink-0 opacity-70" />
                        )}
                    </span>
                )}
            </div>

            {/* Actions (visible on hover) */}
            {!isEditing && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                        onClick={() => { setEditValue(item.text); setIsEditing(true); }}
                        className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Edit section: ${item.text}`}
                    >
                        <Pencil size={13} />
                    </button>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove section: ${item.text}`}
                    >
                        <X size={13} />
                    </button>
                </div>
            )}
        </div>
    );
}
