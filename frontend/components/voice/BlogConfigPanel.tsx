import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { VoiceOptions } from './VoiceOptions';

interface BlogConfigPanelProps {
    title: string;
    onTitleChange: (val: string) => void;
    keyword: string;
    onKeywordChange: (val: string) => void;
    tone: string;
    onToneChange: (val: string) => void;
    wordCount: number;
    onWordCountChange: (val: number) => void;
    preserveVoice: boolean;
    onPreserveVoiceChange: (val: boolean) => void;
    includesQuotes: boolean;
    onIncludesQuotesChange: (val: boolean) => void;
    addSeo: boolean;
    onAddSeoChange: (val: boolean) => void;
}

export const BlogConfigPanel: React.FC<BlogConfigPanelProps> = ({
    title, onTitleChange,
    keyword, onKeywordChange,
    tone, onToneChange,
    wordCount, onWordCountChange,
    preserveVoice, onPreserveVoiceChange,
    includesQuotes, onIncludesQuotesChange,
    addSeo, onAddSeoChange
}) => {
    return (
        <div className="flex flex-col gap-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-white/40">Blog Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="bg-white/5 border-white/10 h-11 focus:border-accent"
                        placeholder="Enter blog title..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keyword" className="text-xs font-bold uppercase tracking-wider text-white/40">Focus Keyword</Label>
                    <Input
                        id="keyword"
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        className="bg-white/5 border-white/10 h-11 focus:border-accent"
                        placeholder="primary-keyword"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/40">Target Tone</Label>
                        <Select value={tone} onValueChange={(val) => onToneChange(val as string)}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-11">
                                <SelectValue placeholder="Tone" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0d0d0d] border-white/10">
                                <SelectItem value="conversational">Conversational</SelectItem>
                                <SelectItem value="educational">Educational</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                                <SelectItem value="storytelling">Storytelling</SelectItem>
                                <SelectItem value="motivational">Motivational</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/40">Output Format</Label>
                        <div className="flex gap-1 bg-white/5 border border-white/10 p-1 rounded-lg h-11">
                            <button className="flex-1 text-[10px] font-bold bg-white/10 rounded">HTML</button>
                            <button className="flex-1 text-[10px] font-bold text-white/40">MD</button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/40">Target Word Count</Label>
                        <span className="text-xs font-mono font-bold text-accent">{wordCount}</span>
                    </div>
                    <Slider
                        value={[wordCount]}
                        onValueChange={(vals: any) => {
                            if (Array.isArray(vals)) {
                                onWordCountChange(vals[0]);
                            } else if (typeof vals === 'number') {
                                onWordCountChange(vals);
                            }
                        }}
                        min={500}
                        max={3000}
                        step={100}
                        className="py-2"
                    />
                </div>
            </div>

            <VoiceOptions
                preserveVoice={preserveVoice}
                onPreserveVoiceChange={onPreserveVoiceChange}
                includesQuotes={includesQuotes}
                onIncludesQuotesChange={onIncludesQuotesChange}
                addSeo={addSeo}
                onAddSeoChange={onAddSeoChange}
            />
        </div>
    );
};
