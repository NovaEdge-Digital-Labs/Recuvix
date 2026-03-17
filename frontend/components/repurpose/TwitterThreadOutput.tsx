"use client";

import React, { useState, useEffect } from 'react';
import { RepurposeToolbar } from './RepurposeToolbar';
import { ShareButtons } from './ShareButtons';
import { TwitterTweetCard } from './TwitterTweetCard';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { toast } from 'sonner';

interface TwitterThreadOutputProps {
    content: RepurposeContent;
    blogUrl: string;
    onUpdate: (updates: Partial<RepurposeContent>) => Promise<void>;
    onRegenerate: () => void;
}

export const TwitterThreadOutput: React.FC<TwitterThreadOutputProps> = ({
    content,
    blogUrl,
    onUpdate,
    onRegenerate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tweets, setTweets] = useState<string[]>(content.tweets || []);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTweets(content.tweets || []);
    }, [content.tweets]);

    const handleCopyAll = () => {
        const fullThread = tweets.join('\n\n---\n\n');
        navigator.clipboard.writeText(fullThread);
        toast.success('Full thread copied to clipboard');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdate({ tweets, content: tweets.join('\n\n') });
            setIsEditing(false);
            toast.success('Twitter thread updated');
        } catch (err) {
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTweets(content.tweets || []);
        setIsEditing(false);
    };

    const handleUpdateTweet = (index: number, text: string) => {
        const newTweets = [...tweets];
        newTweets[index] = text;
        setTweets(newTweets);
    };

    return (
        <div className="flex flex-col h-full bg-card/30 rounded-xl border border-white/5 overflow-hidden">
            <RepurposeToolbar
                content={tweets.join('\n\n')}
                isEditing={isEditing}
                isSaving={isSaving}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onRegenerate={onRegenerate}
                onCopy={handleCopyAll}
            />

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {tweets.map((tweet, idx) => (
                    <TwitterTweetCard
                        key={idx}
                        index={idx}
                        content={tweet}
                        isEditing={isEditing}
                        onEdit={(text) => handleUpdateTweet(idx, text)}
                    />
                ))}

                {tweets.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-white/20">
                        <p>No tweets generated yet.</p>
                    </div>
                )}
            </div>

            <ShareButtons
                format="twitter"
                blogUrl={blogUrl}
                content={tweets.join('\n\n')}
                firstTweet={tweets[0]}
            />
        </div>
    );
};
