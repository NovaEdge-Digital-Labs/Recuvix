"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Linkedin,
    Twitter as TwitterIcon,
    Share2,
    ExternalLink,
    MessageCircle,
    Pin
} from 'lucide-react';
import { RepurposeFormat } from '@/lib/repurpose/repurposePromptBuilder';

interface ShareButtonsProps {
    format: RepurposeFormat;
    blogUrl: string;
    content: string;
    firstTweet?: string;
    pinDescription?: string;
    whatsappMessage?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
    format,
    blogUrl,
    content,
    firstTweet,
    pinDescription,
    whatsappMessage,
}) => {
    const encodedUrl = encodeURIComponent(blogUrl);
    const encodedText = encodeURIComponent(content.slice(0, 2000));

    const shareLinks: Partial<Record<RepurposeFormat, { label: string; icon: React.ReactNode; url: string; onClick?: () => void }>> = {
        linkedin: {
            label: 'Share on LinkedIn',
            icon: <Linkedin className="w-4 h-4 mr-2" />,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            onClick: () => {
                navigator.clipboard.writeText(content);
                // Toast is handled by parent but we add it for safety
            }
        },
        twitter: {
            label: 'Post to X',
            icon: <TwitterIcon className="w-4 h-4 mr-2" />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet || content.slice(0, 280))}&url=${encodedUrl}`,
            onClick: () => {
                navigator.clipboard.writeText(content);
            }
        },
        whatsapp: {
            label: 'Send via WhatsApp',
            icon: <MessageCircle className="w-4 h-4 mr-2" />,
            url: `https://wa.me/?text=${encodeURIComponent(whatsappMessage || content)}`,
        },
        pinterest: {
            label: 'Pin it',
            icon: <Pin className="w-4 h-4 mr-2" />,
            url: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodeURIComponent(pinDescription || content)}`,
        }
    };

    const config = shareLinks[format];
    if (!config) return null;

    return (
        <div className="flex items-center gap-3 p-4 bg-white/5 border-t border-white/5 rounded-b-xl">
            <Button
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={() => {
                    if (config.onClick) config.onClick();
                    window.open(config.url, '_blank', 'noopener,noreferrer');
                }}
            >
                {config.icon}
                {config.label}
                <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
            </Button>

            <p className="text-[10px] text-white/30 italic">
                {format === 'linkedin' || format === 'twitter' ?
                    '*Full text copied to clipboard for easy pasting.' :
                    '*Sharing will open in a new window.'}
            </p>
        </div>
    );
};
