import React from 'react';
import { HistoryIndexEntry } from '@/lib/history/historySearch';
import { HistoryBlogCard } from './HistoryBlogCard';
import { HistoryBlogRow } from './HistoryBlogRow';

interface HistoryGridProps {
    entries: HistoryIndexEntry[];
    viewMode: 'grid' | 'list';
    selectedIds: string[];
    onSelect: (id: string) => void;
    onOpen: (id: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDownload: (id: string, format: any) => void;
    onToggleStar: (id: string) => void;
    onDelete: (id: string) => void;
    onRegenerate: (id: string) => void;
    onEditTags: (id: string) => void;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({
    entries,
    viewMode,
    selectedIds,
    onSelect,
    onOpen,
    onDownload,
    onToggleStar,
    onDelete,
    onRegenerate,
    onEditTags
}) => {
    if (viewMode === 'list') {
        return (
            <div className="flex flex-col gap-2">
                {entries.map(entry => (
                    <HistoryBlogRow
                        key={entry.id}
                        entry={entry}
                        isSelected={selectedIds.includes(entry.id)}
                        onSelect={onSelect}
                        onOpen={onOpen}
                        onDownload={onDownload}
                        onToggleStar={onToggleStar}
                        onDelete={onDelete}
                        onRegenerate={onRegenerate}
                        onEditTags={onEditTags}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map(entry => (
                <HistoryBlogCard
                    key={entry.id}
                    entry={entry}
                    isSelected={selectedIds.includes(entry.id)}
                    onSelect={onSelect}
                    onOpen={onOpen}
                    onDownload={onDownload}
                    onToggleStar={onToggleStar}
                    onDelete={onDelete}
                    onRegenerate={onRegenerate}
                    onEditTags={onEditTags}
                />
            ))}
        </div>
    );
};
