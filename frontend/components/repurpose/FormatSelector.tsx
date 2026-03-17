"use client";

import React from 'react';
import { FormatCard } from './FormatCard';
import { RepurposeFormat } from '@/lib/repurpose/repurposePromptBuilder';
import { FormatStatus } from '@/hooks/useRepurpose';
import { Button } from '@/components/ui/button';
import { Sparkles, X, LayoutGrid, ScrollText, CheckCircle } from 'lucide-react';
import { CustomInstructionInput } from './CustomInstructionInput';
import { cn } from '@/lib/utils';

interface FormatSelectorProps {
    selectedFormats: RepurposeFormat[];
    formatStates: Record<string, any>;
    isGenerating: boolean;
    customInstruction: string;
    completedCount: number;
    totalCount: number;
    model: string | null;
    onToggleFormat: (format: RepurposeFormat) => void;
    onSelectSocialPack: () => void;
    onSelectContentPack: () => void;
    onSelectAll: () => void;
    onClearAll: () => void;
    onGenerate: () => void;
    onSetActiveTab: (format: RepurposeFormat) => void;
    onSetCustomInstruction: (text: string) => void;
}

const FORMAT_CONFIG: { format: RepurposeFormat; label: string; description: string }[] = [
    { format: 'linkedin', label: 'LinkedIn Post', description: 'Professional · 1200-1900 chars' },
    { format: 'twitter', label: 'Twitter/X Thread', description: 'Threads · 8-15 tweets' },
    { format: 'email', label: 'Email Newsletter', description: 'HTML Email · Subject + Body' },
    { format: 'youtube', label: 'YouTube Script', description: 'Video Script · with Timestamps' },
    { format: 'instagram', label: 'Instagram Caption', description: 'Engagement · with Hashtags' },
    { format: 'facebook', label: 'Facebook Post', description: 'Conversational · 150-300 words' },
    { format: 'whatsapp', label: 'WhatsApp Message', description: 'Casual · under 400 chars' },
    { format: 'pinterest', label: 'Pinterest Pin', description: 'SEO Rich · Title + Description' },
];

export const FormatSelector: React.FC<FormatSelectorProps> = ({
    selectedFormats,
    formatStates,
    isGenerating,
    customInstruction,
    completedCount,
    totalCount,
    model,
    onToggleFormat,
    onSelectSocialPack,
    onSelectContentPack,
    onSelectAll,
    onClearAll,
    onGenerate,
    onSetActiveTab,
    onSetCustomInstruction,
}) => {
    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight text-white">Select Formats</h3>
                <p className="text-sm text-white/40">Choose where you want to repurpose this blog</p>
            </div>

            {/* Quick Select Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSelectSocialPack}
                    className="h-8 text-[11px] border-white/5 bg-white/5 hover:bg-white/10"
                >
                    <LayoutGrid className="w-3 h-3 mr-1.5" />
                    Social Pack
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSelectContentPack}
                    className="h-8 text-[11px] border-white/5 bg-white/5 hover:bg-white/10"
                >
                    <ScrollText className="w-3 h-3 mr-1.5" />
                    Content Pack
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onSelectAll}
                    className="h-8 text-[11px] border-white/5 bg-white/5 hover:bg-white/10"
                >
                    <CheckCircle className="w-3 h-3 mr-1.5" />
                    All
                </Button>
                {selectedFormats.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearAll}
                        className="h-8 text-[11px] text-white/40 hover:text-white"
                    >
                        <X className="w-3 h-3 mr-1.5" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Format List */}
            <div className="space-y-2 overflow-y-auto pr-2 max-h-[500px] scrollbar-hide">
                {FORMAT_CONFIG.map((config) => (
                    <FormatCard
                        key={config.format}
                        format={config.format}
                        label={config.label}
                        description={config.description}
                        isSelected={selectedFormats.includes(config.format)}
                        status={formatStates[config.format]?.status}
                        onToggle={() => onToggleFormat(config.format)}
                        onView={() => onSetActiveTab(config.format)}
                        onRegenerate={() => { }} // Handled by toggle -> generate
                    />
                ))}
            </div>

            {/* Custom Instruction */}
            <CustomInstructionInput
                value={customInstruction}
                onChange={onSetCustomInstruction}
            />

            {/* Generation Button */}
            <div className="pt-2">
                <Button
                    size="lg"
                    className={cn(
                        "w-full h-14 text-base font-bold transition-all duration-300",
                        isGenerating ? "bg-accent/50 cursor-wait" : "bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(var(--accent),0.3)]"
                    )}
                    onClick={onGenerate}
                    disabled={selectedFormats.length === 0 || isGenerating}
                >
                    {isGenerating ? (
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-5 h-5 border-2 border-white/20 rounded-full" />
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                            <span>Generating {completedCount}/{totalCount}...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            <span>Generate {selectedFormats.length > 0 ? selectedFormats.length : ''} Formats</span>
                        </div>
                    )}
                </Button>
                <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-white/30 uppercase tracking-widest">
                    <span>Model: {model || 'Auto'}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>0 Credits</span>
                </div>
            </div>
        </div>
    );
};
