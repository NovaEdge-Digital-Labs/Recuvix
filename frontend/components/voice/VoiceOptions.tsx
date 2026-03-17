import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mic, Search, Quote } from 'lucide-react';

interface VoiceOptionsProps {
    preserveVoice: boolean;
    onPreserveVoiceChange: (val: boolean) => void;
    includesQuotes: boolean;
    onIncludesQuotesChange: (val: boolean) => void;
    addSeo: boolean;
    onAddSeoChange: (val: boolean) => void;
}

export const VoiceOptions: React.FC<VoiceOptionsProps> = ({
    preserveVoice, onPreserveVoiceChange,
    includesQuotes, onIncludesQuotesChange,
    addSeo, onAddSeoChange
}) => {
    return (
        <div className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Voice Tuning</p>

            <div className="flex items-center justify-between group">
                <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-accent" />
                        Preserve Speaker Voice
                    </Label>
                    <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">
                        Keep first-person "I" and natural style
                    </span>
                </div>
                <Switch checked={preserveVoice} onCheckedChange={onPreserveVoiceChange} />
            </div>

            <div className="flex items-center justify-between group">
                <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Quote className="w-3.5 h-3.5 text-accent" />
                        Feature Strong Quotes
                    </Label>
                    <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">
                        Auto-insert blockquotes for highlights
                    </span>
                </div>
                <Switch checked={includesQuotes} onCheckedChange={onIncludesQuotesChange} />
            </div>

            <div className="flex items-center justify-between group">
                <div className="flex flex-col gap-0.5">
                    <Label className="text-sm font-medium flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-accent" />
                        SEO Voice Enhancements
                    </Label>
                    <span className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">
                        Add FAQ and smart keyword placement
                    </span>
                </div>
                <Switch checked={addSeo} onCheckedChange={onAddSeoChange} />
            </div>
        </div>
    );
};
