"use client";

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { RepurposeFormat } from '@/lib/repurpose/repurposePromptBuilder';
import { FormatStatus } from '@/hooks/useRepurpose';
import {
    Linkedin,
    Twitter,
    Mail,
    Youtube,
    Instagram,
    Facebook,
    MessageSquare,
    Pin,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Eye
} from 'lucide-react';

interface FormatCardProps {
    format: RepurposeFormat;
    label: string;
    description: string;
    isSelected: boolean;
    status?: FormatStatus;
    onToggle: () => void;
    onView: () => void;
    onRegenerate: () => void;
}

const FormatIcons: Record<RepurposeFormat, React.ReactNode> = {
    linkedin: <Linkedin className="w-5 h-5 text-[#0077b5]" />,
    twitter: <Twitter className="w-5 h-5 text-white" />,
    email: <Mail className="w-5 h-5 text-gray-400" />,
    youtube: <Youtube className="w-5 h-5 text-[#ff0000]" />,
    instagram: <Instagram className="w-5 h-5 text-[#e4405f]" />,
    facebook: <Facebook className="w-5 h-5 text-[#1877f2]" />,
    whatsapp: <MessageSquare className="w-5 h-5 text-[#25d366]" />,
    pinterest: <Pin className="w-5 h-5 text-[#bd081c]" />,
};

export const FormatCard: React.FC<FormatCardProps> = ({
    format,
    label,
    description,
    isSelected,
    status = 'idle',
    onToggle,
    onView,
    onRegenerate,
}) => {
    const isGenerating = status === 'generating';
    const isComplete = status === 'complete' || status === 'saved';
    const isFailed = status === 'failed';

    return (
        <div
            className={cn(
                "group relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden",
                isSelected ? "bg-accent/10 border-accent shadow-[0_0_15px_rgba(var(--accent),0.1)]" : "bg-card/50 border-white/5 hover:border-white/10",
                isSelected && "border-l-4"
            )}
            onClick={onToggle}
        >
            <div className="flex items-center gap-4 flex-1">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={onToggle}
                    className={cn("transition-opacity", !isSelected && "opacity-50")}
                />

                <div className={cn("p-2 rounded-lg bg-white/5", !isSelected && "opacity-60")}>
                    {FormatIcons[format]}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className={cn("text-sm font-semibold transition-colors", isSelected ? "text-white" : "text-white/70")}>
                        {label}
                    </h4>
                    <p className="text-xs text-white/40 truncate">{description}</p>
                </div>

                <div className="flex items-center gap-2">
                    {isGenerating && (
                        <div className="flex items-center gap-1.5 text-[10px] text-accent font-medium animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Writing...</span>
                        </div>
                    )}

                    {isComplete && (
                        <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Generated</span>
                        </div>
                    )}

                    {isFailed && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            <span>Failed</span>
                        </div>
                    )}

                    {isComplete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onView();
                            }}
                            className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                            title="View content"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Glossy overlay effect for selected state */}
            {isSelected && (
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-accent/5 to-transparent" />
            )}
        </div>
    );
};
