"use client";

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TwitterTweetCardProps {
    index: number;
    content: string;
    isEditing: boolean;
    onEdit: (text: string) => void;
}

export const TwitterTweetCard: React.FC<TwitterTweetCardProps> = ({
    index,
    content,
    isEditing,
    onEdit,
}) => {
    const [copied, setCopied] = useState(false);
    const charCount = content.length;
    const isOverLimit = charCount > 280;

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative bg-white/5 border border-white/5 rounded-xl p-4 transition-all hover:border-white/10">
            <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                        {index + 1}
                    </div>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Tweet</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className={cn(
                        "text-[10px] font-mono",
                        isOverLimit ? "text-red-400 font-bold" : "text-white/30"
                    )}>
                        {charCount}/280
                    </div>
                    <button
                        onClick={handleCopy}
                        className="text-white/30 hover:text-white transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            <div
                contentEditable={isEditing}
                suppressContentEditableWarning
                onInput={(e) => onEdit(e.currentTarget.innerText)}
                className={cn(
                    "text-sm leading-relaxed text-white/80 outline-none whitespace-pre-wrap",
                    isEditing && "p-2 bg-black/20 rounded border border-white/10"
                )}
            >
                {content}
            </div>

            {/* Thread line connecting tweets */}
            <div className="absolute left-[27px] top-[40px] bottom-[-24px] w-0.5 bg-white/5 group-last:hidden" />
        </div>
    );
};
