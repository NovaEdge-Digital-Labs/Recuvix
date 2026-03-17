"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepurposeFormat } from '@/lib/repurpose/repurposePromptBuilder';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { LinkedInOutput } from './LinkedInOutput';
import { TwitterThreadOutput } from './TwitterThreadOutput';
import { EmailOutput } from './EmailOutput';
import { YouTubeScriptOutput } from './YouTubeScriptOutput';
import { GenericOutput } from './GenericOutput';
import { cn } from '@/lib/utils';
import {
    Sparkles,
    Linkedin,
    Twitter,
    Mail,
    Youtube,
    Instagram,
    Facebook,
    MessageSquare,
    Pin,
    Clock
} from 'lucide-react';

interface ContentViewerProps {
    activeTab: RepurposeFormat | null;
    generatedContent: Record<string, RepurposeContent>;
    blogUrl: string;
    onSetActiveTab: (format: RepurposeFormat) => void;
    onUpdateContent: (format: RepurposeFormat, updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerateFormat: (format: RepurposeFormat) => void;
}

const TAB_ICONS: Record<RepurposeFormat, React.ReactNode> = {
    linkedin: <Linkedin className="w-3.5 h-3.5" />,
    twitter: <Twitter className="w-3.5 h-3.5" />,
    email: <Mail className="w-3.5 h-3.5" />,
    youtube: <Youtube className="w-3.5 h-3.5" />,
    instagram: <Instagram className="w-3.5 h-3.5" />,
    facebook: <Facebook className="w-3.5 h-3.5" />,
    whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
    pinterest: <Pin className="w-3.5 h-3.5" />,
};

export const ContentViewer: React.FC<ContentViewerProps> = ({
    activeTab,
    generatedContent,
    blogUrl,
    onSetActiveTab,
    onUpdateContent,
    onRegenerateFormat,
}) => {
    const formatsWithContent = Object.keys(generatedContent) as RepurposeFormat[];

    if (formatsWithContent.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] rounded-xl border border-dashed border-white/10 bg-white/5">
                <div className="p-4 rounded-full bg-accent/10 mb-4">
                    <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white">No content generated yet</h3>
                <p className="text-sm text-white/40 max-w-xs text-center mt-2">
                    Select your formats and click generate to see the AI magic happen.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full rounded-xl overflow-hidden border border-white/5 bg-black/20">
            <Tabs
                value={activeTab || formatsWithContent[0]}
                onValueChange={(v) => onSetActiveTab(v as RepurposeFormat)}
                className="w-full h-full flex flex-col"
            >
                <div className="bg-white/5 border-b border-white/5 px-2">
                    <TabsList className="bg-transparent h-12 gap-2">
                        {formatsWithContent.map((format) => (
                            <TabsTrigger
                                key={format}
                                value={format}
                                className={cn(
                                    "data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 h-8 gap-2",
                                    "transition-all duration-200"
                                )}
                            >
                                {TAB_ICONS[format]}
                                <span className="capitalize">{format}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                    {formatsWithContent.map((format) => (
                        <TabsContent
                            key={format}
                            value={format}
                            className="w-full h-full mt-0 focus-visible:outline-none"
                        >
                            <TabContentRenderer
                                format={format}
                                content={generatedContent[format]}
                                blogUrl={blogUrl}
                                onUpdate={(updates) => onUpdateContent(format, updates)}
                                onRegenerate={() => onRegenerateFormat(format)}
                            />
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
};

const TabContentRenderer = ({ format, content, blogUrl, onUpdate, onRegenerate }: {
    format: RepurposeFormat;
    content: RepurposeContent;
    blogUrl: string;
    onUpdate: (updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerate: () => void;
}) => {
    switch (format) {
        case 'linkedin':
            return <LinkedInOutput content={content} blogUrl={blogUrl} onUpdate={onUpdate} onRegenerate={onRegenerate} />;
        case 'twitter':
            return <TwitterThreadOutput content={content} blogUrl={blogUrl} onUpdate={onUpdate} onRegenerate={onRegenerate} />;
        case 'email':
            return <EmailOutput content={content} onUpdate={onUpdate} onRegenerate={onRegenerate} />;
        case 'youtube':
            return <YouTubeScriptOutput content={content} onUpdate={onUpdate} onRegenerate={onRegenerate} />;
        default:
            return <GenericOutput format={format} content={content} blogUrl={blogUrl} onUpdate={onUpdate} onRegenerate={onRegenerate} />;
    }
};
