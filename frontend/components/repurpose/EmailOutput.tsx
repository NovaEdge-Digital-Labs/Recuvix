"use client";

import React, { useState, useEffect } from 'react';
import { RepurposeToolbar } from './RepurposeToolbar';
import { EmailPreview } from './EmailPreview';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, Code } from 'lucide-react';

interface EmailOutputProps {
    content: RepurposeContent;
    onUpdate: (updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerate: () => void;
}

export const EmailOutput: React.FC<EmailOutputProps> = ({
    content,
    onUpdate,
    onRegenerate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [textVersion, setTextVersion] = useState(content.textVersion || content.content);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'text'>('preview');

    useEffect(() => {
        setTextVersion(content.textVersion || content.content);
    }, [content.textVersion, content.content]);

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(content.html || '');
        toast.success('HTML Email copied to clipboard');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ textVersion, content: textVersion });
            setIsEditing(false);
            toast.success('Email content updated');
        } catch (err) {
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTextVersion(content.textVersion || content.content);
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col h-full bg-card/30 rounded-xl border border-white/5 overflow-hidden">
            <RepurposeToolbar
                content={textVersion}
                isEditing={isEditing}
                isSaving={isSaving}
                onEdit={() => {
                    setIsEditing(true);
                    setActiveTab('text');
                }}
                onSave={handleSave}
                onCancel={handleCancel}
                onRegenerate={onRegenerate}
                onCopy={handleCopyHtml}
            />

            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="preview" className="data-[state=active]:bg-accent/20">
                                <Eye className="w-3.5 h-3.5 mr-2" />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger value="text" className="data-[state=active]:bg-accent/20">
                                <Code className="w-3.5 h-3.5 mr-2" />
                                Plain Text
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === 'preview' && (
                            <button
                                onClick={handleCopyHtml}
                                className="text-xs text-accent hover:underline flex items-center gap-1.5"
                            >
                                <Copy className="w-3 h-3" />
                                Copy HTML Code
                            </button>
                        )}
                    </div>

                    <TabsContent value="preview" className="flex-1 mt-0">
                        <EmailPreview html={content.html || ''} />
                    </TabsContent>

                    <TabsContent value="text" className="flex-1 mt-0">
                        <textarea
                            value={textVersion}
                            readOnly={!isEditing}
                            onChange={(e) => setTextVersion(e.target.value)}
                            className={x(
                                "w-full h-full bg-black/20 border-white/10 rounded-lg p-4 text-sm leading-relaxed text-white/70 outline-none resize-none transition-all",
                                isEditing && "focus:border-accent/50 ring-1 ring-accent/10"
                            )}
                            placeholder="Email text version..."
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

function x(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
