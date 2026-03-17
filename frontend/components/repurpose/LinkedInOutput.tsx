"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RepurposeToolbar } from './RepurposeToolbar';
import { ShareButtons } from './ShareButtons';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { toast } from 'sonner';

interface LinkedInOutputProps {
    content: RepurposeContent;
    blogUrl: string;
    onUpdate: (updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerate: () => void;
}

export const LinkedInOutput: React.FC<LinkedInOutputProps> = ({
    content,
    blogUrl,
    onUpdate,
    onRegenerate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableText, setEditableText] = useState(content.content);
    const [isSaving, setIsSaving] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setEditableText(content.content);
    }, [content.content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(editableText);
        toast.success('LinkedIn post copied to clipboard');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ content: editableText });
            setIsEditing(false);
            toast.success('LinkedIn post updated');
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
                charLimit={3000}
                optimalRange={[1200, 1900]}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onRegenerate={onRegenerate}
                onCopy={handleCopy}
            />

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div
                    ref={editorRef}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => setEditableText(e.currentTarget.innerText)}
                    className={x(
                        "text-base leading-relaxed text-white/80 whitespace-pre-wrap outline-none p-4 rounded-lg transition-all",
                        isEditing ? "bg-white/5 border border-accent/20 ring-1 ring-accent/10" : "bg-transparent"
                    )}
                >
                    {editableText}
                </div>
            </div>

            <ShareButtons
                format="linkedin"
                blogUrl={blogUrl}
                content={editableText}
            />
        </div>
    );
};

// Helper for conditional classes if not already available
function x(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
