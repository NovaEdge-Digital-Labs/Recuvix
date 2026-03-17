"use client";

import React, { useState, useEffect } from 'react';
import { RepurposeToolbar } from './RepurposeToolbar';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { toast } from 'sonner';
import { Video, Clock, ListChecks } from 'lucide-react';

interface YouTubeScriptOutputProps {
    content: RepurposeContent;
    onUpdate: (updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerate: () => void;
}

export const YouTubeScriptOutput: React.FC<YouTubeScriptOutputProps> = ({
    content,
    onUpdate,
    onRegenerate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableText, setEditableText] = useState(content.content);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditableText(content.content);
    }, [content.content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(editableText);
        toast.success('YouTube script copied');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ content: editableText });
            setIsEditing(false);
            toast.success('Script updated');
        } catch (err) {
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditableText(content.content);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-card/30 rounded-xl border border-white/5 overflow-hidden">
            <RepurposeToolbar
                content={editableText}
                isEditing={isEditing}
                isSaving={isSaving}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onRegenerate={onRegenerate}
                onCopy={handleCopy}
            />

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="flex items-center gap-3 mb-6 p-4 bg-white/5 rounded-lg border border-white/5">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <Video className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Video Script Layout</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Optimized for retention</p>
                    </div>
                </div>

                <div
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => setEditableText(e.currentTarget.innerText)}
                    className={x(
                        "text-base leading-relaxed text-white/80 whitespace-pre-wrap outline-none p-4 rounded-lg transition-all",
                        isEditing ? "bg-white/5 border border-white/10 shadow-inner" : "bg-transparent"
                    )}
                >
                    {editableText}
                </div>
            </div>

            <div className="bg-white/5 p-4 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Timestamps included</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ListChecks className="w-3.5 h-3.5" />
                        <span>B-roll cues</span>
                    </div>
                </div>
                <p className="italic">*Generated based on blog structure.</p>
            </div>
        </div>
    );
};

function x(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
