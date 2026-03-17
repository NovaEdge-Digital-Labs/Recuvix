"use client";

import React from 'react';
import { BulkSettings } from '@/lib/validators/bulkSchemas';
import { Label } from '@/components/ui/label';

import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Globe, Cpu, FileText, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BulkSettingsPanelProps {
    settings: BulkSettings;
    onChange: (settings: BulkSettings) => void;
}

export function BulkSettingsPanel({ settings, onChange }: BulkSettingsPanelProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateSetting = (key: keyof BulkSettings, value: any) => {
        onChange({ ...settings, [key]: value });
    };

    return (
        <div className="space-y-6">
            {/* Core Settings */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Globe className="h-4 w-4 text-blue-400" />
                        Target Country
                    </Label>
                    <Select value={settings.country} onValueChange={(v) => updateSetting('country', v)}>
                        <SelectTrigger className="bg-background/50 border-border">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="United States (US)">United States (US)</SelectItem>
                            <SelectItem value="United Kingdom (UK)">United Kingdom (UK)</SelectItem>
                            <SelectItem value="Canada (CA)">Canada (CA)</SelectItem>
                            <SelectItem value="Australia (AU)">Australia (AU)</SelectItem>
                            <SelectItem value="India (IN)">India (IN)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Cpu className="h-4 w-4 text-purple-400" />
                        Content Tone
                    </Label>
                    <Select value={settings.tone} onValueChange={(v) => updateSetting('tone', v)}>
                        <SelectTrigger className="bg-background/50 border-border">
                            <SelectValue placeholder="Select Tone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Professional & Authoritative">Professional & Authoritative</SelectItem>
                            <SelectItem value="Conversational & Friendly">Conversational & Friendly</SelectItem>
                            <SelectItem value="Witty & Humorous">Witty & Humorous</SelectItem>
                            <SelectItem value="Direct & Minimalist">Direct & Minimalist</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                            <FileText className="h-4 w-4 text-green-400" />
                            Target Word Count
                        </Label>
                        <Badge variant="outline" className="text-foreground border-accent/20">{settings.wordCount} words</Badge>
                    </div>
                    <Slider
                        value={[settings.wordCount]}
                        min={300}
                        max={5000}
                        step={100}
                        onValueChange={(v) => updateSetting('wordCount', Array.isArray(v) ? v[0] : v)}
                        className="py-4"
                    />
                </div>
            </div>

            <hr className="border-border" />

            {/* Pipeline Toggles */}
            <div className="space-y-4">
                <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-semibold cursor-pointer group-hover:text-foreground transition-colors">Generate Outline First</Label>
                        <p className="text-[10px] text-muted-foreground">Increases content quality and structure</p>
                    </div>
                    <Switch
                        checked={settings.includeOutlinePreview}
                        onCheckedChange={(v) => updateSetting('includeOutlinePreview', v)}
                    />
                </div>

                <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-semibold cursor-pointer group-hover:text-foreground transition-colors">AI Background Images</Label>
                        <p className="text-[10px] text-muted-foreground">Unique AI generated visuals</p>
                    </div>
                    <Switch
                        checked={settings.includeAiImages}
                        onCheckedChange={(v) => updateSetting('includeAiImages', v)}
                    />
                </div>

                <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-semibold cursor-pointer group-hover:text-foreground transition-colors">Premium Thumbnails</Label>
                        <p className="text-[10px] text-muted-foreground">Cinematic branded covers</p>
                    </div>
                    <Switch
                        checked={settings.includeThumbnail}
                        onCheckedChange={(v) => updateSetting('includeThumbnail', v)}
                    />
                </div>

                <div className="flex items-center justify-between group">
                    <div className="space-y-0.5">
                        <Label className="text-sm font-semibold cursor-pointer group-hover:text-foreground transition-colors">Full SEO Pack</Label>
                        <p className="text-[10px] text-muted-foreground">Meta tags, schemas, OG tags</p>
                    </div>
                    <Switch
                        checked={settings.includeSeoPack}
                        onCheckedChange={(v) => updateSetting('includeSeoPack', v)}
                    />
                </div>
            </div>

            <hr className="border-border" />

            {/* Advanced / Queue Control */}
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                            <Clock className="h-4 w-4 text-orange-400" />
                            Delay Between Blogs
                        </Label>
                        <span className="text-[10px] font-mono text-muted-foreground">{settings.delayBetweenBlogs}s</span>
                    </div>
                    <Slider
                        value={[settings.delayBetweenBlogs]}
                        min={3}
                        max={60}
                        step={1}
                        onValueChange={(v) => updateSetting('delayBetweenBlogs', Array.isArray(v) ? v[0] : v)}
                    />
                </div>

                <div className="flex items-center justify-between group">
                    <Label className="text-sm font-semibold cursor-pointer group-hover:text-foreground transition-colors">Notify on Complete</Label>
                    <Switch
                        checked={settings.notifyOnComplete}
                        onCheckedChange={(v) => updateSetting('notifyOnComplete', v)}
                    />
                </div>
            </div>
        </div>
    );
}
