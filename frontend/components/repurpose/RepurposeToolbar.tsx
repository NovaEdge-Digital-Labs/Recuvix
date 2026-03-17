"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Edit2, RotateCw, Check, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RepurposeToolbarProps {
    content: string;
    isEditing: boolean;
    isSaving?: boolean;
    charLimit?: number;
    optimalRange?: [number, number];
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onRegenerate: () => void;
    onCopy: () => void;
}

export const RepurposeToolbar: React.FC<RepurposeToolbarProps> = ({
    content,
    isEditing,
    isSaving,
    charLimit,
    optimalRange,
    onEdit,
    onSave,
    onCancel,
    onRegenerate,
    onCopy,
}) => {
    const charCount = content.length;

    const getStatusColor = () => {
        if (!charLimit && !optimalRange) return 'text-white/40';
        if (charLimit && charCount > charLimit) return 'text-red-400';
        if (optimalRange) {
            if (charCount >= optimalRange[0] && charCount <= optimalRange[1]) return 'text-green-400';
            return 'text-yellow-400';
        }
        return 'text-white/40';
    };

    return (
        <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <Button
                            size="sm"
                            onClick={onSave}
                            disabled={isSaving}
                            className="h-8 bg-green-500 hover:bg-green-600 text-white"
                        >
                            {isSaving ? <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
                            Save Changes
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onCancel}
                            className="h-8 text-white/60 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5 mr-1.5" />
                            Discard
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onCopy}
                            className="h-8 border-white/10 bg-white/5 hover:bg-white/10"
                        >
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            Copy
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                            className="h-8 border-white/10 bg-white/5 hover:bg-white/10"
                        >
                            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onRegenerate}
                            className="h-8 border-white/10 bg-white/5 hover:bg-white/10"
                        >
                            <RotateCw className="w-3.5 h-3.5 mr-1.5" />
                            Regenerate
                        </Button>
                    </>
                )}
            </div>

            <div className="flex items-center gap-3">
                <div className={cn("text-xs font-medium flex items-center gap-1.5", getStatusColor())}>
                    <span>{charCount.toLocaleString()}</span>
                    {charLimit && <span className="opacity-40">/ {charLimit.toLocaleString()}</span>}
                    {optimalRange && charCount >= optimalRange[0] && charCount <= optimalRange[1] && (
                        <CheckCircle2 className="w-3 h-3" />
                    )}
                </div>
            </div>
        </div>
    );
};
