"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomInstructionInputProps {
    value: string;
    onChange: (text: string) => void;
}

export const CustomInstructionInput: React.FC<CustomInstructionInputProps> = ({
    value,
    onChange,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-xl border border-white/5 bg-white/5 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <MessageSquarePlus className="w-4 h-4 text-accent" />
                    <span>Add custom instruction</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/30" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-white/30" />
                )}
            </button>

            {isExpanded && (
                <div className="p-4 pt-0">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="e.g. 'Make it more casual' or 'Focus on the technical aspects'..."
                        className="w-full h-24 bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-accent/50 resize-none"
                    />
                    <p className="mt-2 text-[10px] text-white/30">
                        This instruction will be applied to all selected platform formats.
                    </p>
                </div>
            )}
        </div>
    );
};
