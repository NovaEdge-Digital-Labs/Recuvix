"use client";

import React, { useState, useEffect } from 'react';
import { RepurposeToolbar } from './RepurposeToolbar';
import { ShareButtons } from './ShareButtons';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { RepurposeFormat } from '@/lib/repurpose/repurposePromptBuilder';
import { toast } from 'sonner';

interface GenericOutputProps {
    format: RepurposeFormat;
    content: RepurposeContent;
    blogUrl: string;
    onUpdate: (updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerate: () => void;
}

const FORMAT_CONFIGS: Partial<Record<RepurposeFormat, { charLimit?: number; optimalRange?: [number, number] }>> = {
    instagram: { charLimit: 2200, optimalRange: [500, 1500] },
    facebook: { charLimit: 5000, optimalRange: [400, 1200] },
    whatsapp: { charLimit: 4096, optimalRange: [100, 400] },
};

export const GenericOutput: React.FC<GenericOutputProps> = ({
    format,
    content,
    blogUrl,
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
        toast.success(`${format.charAt(0).toUpperCase() + format.slice(1)} content copied`);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ content: editableText });
            setIsEditing(false);
            toast.success('Content updated');
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

    const config = FORMAT_CONFIGS[format] || {};

    return (
        <div className="flex flex-col h-full bg-card/30 rounded-xl border border-white/5 overflow-hidden">
            <RepurposeToolbar
                content={editableText}
                isEditing={isEditing}
                isSaving={isSaving}
                charLimit={config.charLimit}
                optimalRange={config.optimalRange}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onRegenerate={onRegenerate}
                onCopy={handleCopy}
            />

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onInput={(e) => setEditableText(e.currentTarget.innerText)}
                    className={x(
                        "text-base leading-relaxed text-white/80 whitespace-pre-wrap outline-none p-4 rounded-lg transition-all",
                        isEditing ? "bg-white/5 border border-white/10" : "bg-transparent"
                    )}
                >
                    {editableText}
                </div>
            </div>

            <ShareButtons
                format={format}
                blogUrl={blogUrl}
                content={editableText}
                whatsappMessage={format === 'whatsapp' ? editableText : undefined}
            />
        </div>
    );
};

function x(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
