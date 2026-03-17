"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { H2Item } from "@/lib/types/outline";
import { OutlineH2Item } from "./OutlineH2Item";
import { cn } from "@/lib/utils";

interface OutlineH2ListProps {
    h2s: H2Item[];
    wordCount: number;
    newItemId?: string | null;
    onUpdate: (id: string, text: string) => void;
    onRemove: (id: string) => void;
    onReorder: (newOrder: string[]) => void;
    onAdd: () => void;
}

function getRecommendedRange(wordCount: number): [number, number] {
    if (wordCount < 800) return [4, 5];
    if (wordCount < 1500) return [5, 7];
    if (wordCount < 2500) return [7, 9];
    return [9, 12];
}

export function OutlineH2List({
    h2s,
    wordCount,
    newItemId,
    onUpdate,
    onRemove,
    onReorder,
    onAdd,
}: OutlineH2ListProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [min, max] = getRecommendedRange(wordCount);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (over && active.id !== over.id) {
            const oldIndex = h2s.findIndex(h => h.id === active.id);
            const newIndex = h2s.findIndex(h => h.id === over.id);
            const reordered = arrayMove(h2s, oldIndex, newIndex);
            onReorder(reordered.map(h => h.id));
        }
    };

    const activeItem = h2s.find(h => h.id === activeId);
    const count = h2s.length;

    return (
        <div className="space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground/70 font-medium">
                    Article Structure
                </span>
                <span className="text-xs text-muted-foreground/60">{count} section{count !== 1 ? "s" : ""}</span>
            </div>

            {/* Warnings */}
            {count < min && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} />
                    Your outline has fewer sections than recommended for {wordCount} words ({min}–{max} suggested)
                </div>
            )}
            {count > max + 2 && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                    <AlertTriangle size={12} />
                    That&apos;s a lot of sections — consider merging some for better flow
                </div>
            )}

            {/* Sortable list */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={h2s.map(h => h.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-1">
                        {h2s.map((item, index) => (
                            <OutlineH2Item
                                key={item.id}
                                item={item}
                                index={index}
                                isNew={item.id === newItemId}
                                onUpdate={onUpdate}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeItem && (
                        <div className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border border-accent/40 bg-[#1a1a1a] shadow-xl scale-[1.02]",
                        )}>
                            <span className="font-mono text-[13px] text-muted-foreground/60 shrink-0 w-6 text-right">
                                {String(h2s.findIndex(h => h.id === activeId) + 1).padStart(2, "0")}
                            </span>
                            <span className="text-sm text-foreground">{activeItem.text}</span>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {/* Add button */}
            <button
                onClick={onAdd}
                className="w-full h-10 rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-1.5"
            >
                <Plus size={13} />
                Add Section
            </button>
        </div>
    );
}
