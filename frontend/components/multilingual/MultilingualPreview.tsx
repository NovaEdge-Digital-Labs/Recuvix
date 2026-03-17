/* eslint-disable */
"use client";

import React, { useMemo } from 'react';
import { LanguageQueueItem } from '@/hooks/useMultilingualGeneration';
import { LanguageTabBar } from './LanguageTabBar';
import { LanguagePreviewPanel } from './LanguagePreviewPanel';
import { WordPressPublishButton } from '../wordpress/WordPressPublishButton';
import { useSearchParams } from 'next/navigation';

interface MultilingualPreviewProps {
    queue: LanguageQueueItem[];
    selectedCode: string;
    onSelect: (code: string) => void;
}

export function MultilingualPreview({ queue, selectedCode, onSelect }: MultilingualPreviewProps) {
    const searchParams = useSearchParams();
    const selectedItem = queue.find(i => i.language.code === selectedCode);

    const statusMap = useMemo(() => {
        const map: Record<string, LanguageQueueItem['status']> = {};
        queue.forEach(item => {
            map[item.language.code] = item.status;
        });
        return map;
    }, [queue]);

    const topic = searchParams.get('topic') || 'Untitled Blog';

    return (
        <section className='flex flex-col h-full bg-background rounded-2xl border shadow-sm p-6'>
            <header className='flex items-center justify-between mb-2'>
                <h2 className='text-lg font-bold'>Live Content Preview</h2>
                {selectedItem && (
                    <aside className='flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-full border'>
                        <span className='text-lg'>{selectedItem.language.flag}</span>
                        <span className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none'>
                            {selectedItem.language.name}
                            <span className='mx-1 opacity-30'>|</span>
                            {selectedItem.language.nativeName}
                        </span>
                    </aside>
                )}
            </header>

            <p className='text-xs text-muted-foreground mb-6'>
                Preview the generated blog in each language. Each version is a native localization.
            </p>

            {selectedItem && selectedItem.status === 'complete' && (
                <div className='mb-6 p-4 bg-primary/5 border border-primary/10 rounded-xl'>
                    <WordPressPublishButton
                        blogData={{
                            title: topic,
                            html: selectedItem.blogHtml,
                            metaTitle: '',
                            metaDescription: '',
                            focusKeyword: topic,
                            secondaryKeywords: [],
                            slug: '',
                            thumbnailUrl: null
                        }}
                    />
                </div>
            )}

            <LanguageTabBar
                languages={queue.map(i => i.language)}
                activeCode={selectedCode}
                statusMap={statusMap as any}
                onSelect={onSelect}
            />

            <main className='flex-1 min-h-[600px] relative'>
                {selectedItem ? (
                    <LanguagePreviewPanel
                        language={selectedItem.language}
                        status={selectedItem.status}
                        content={selectedItem.blogHtml}
                        error={selectedItem.error}
                    />
                ) : (
                    <div className='flex items-center justify-center h-full text-muted-foreground italic text-sm'>
                        Select a language to preview content
                    </div>
                )}
            </main>
        </section>
    );
}
