import { useState, useEffect, useMemo, useCallback } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import {
    historyManager,
    HistoryContent
} from '@/lib/history/historyManager';
import {
    HistoryIndexEntry,
    SortOption,
    FilterState,
    filterEntries,
    sortEntries
} from '@/lib/history/historySearch';
import { getHistoryStorageStats } from '@/lib/history/storageCalculator';
import { historyExporter } from '@/lib/history/historyExporter';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { blogsService } from '@/lib/db/blogsService';
import { mapSupabaseToHistoryEntry, mapSupabaseToHistoryContent } from '@/lib/history/supabaseMapper';
import { createClient } from '@/lib/supabase/client';

export const useHistory = (workspaceId?: string) => {
    const router = useRouter();

    // --- State ---
    const [index, setIndex] = useState<HistoryIndexEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activeFilters, setActiveFilters] = useState<FilterState>({
        starred: false,
        published: false,
        countries: [],
        models: [],
        tags: [],
        wordCountMin: 0,
        wordCountMax: 5000,
        dateRange: 'all'
    });
    const { user, profile } = useAuth();
    const [supabaseReady, setSupabaseReady] = useState(false);

    // --- Initial Load ---
    const fetcher = async () => {
        if (!user) return [];
        const { data } = await blogsService.getAll(user.id, {
            limit: 100,
            workspaceId: workspaceId
        });
        return data.map(mapSupabaseToHistoryEntry);
    };

    const { data: supabaseIdx, error: supabaseError, mutate } = useSWR(
        user ? ['blogs', user.id, workspaceId] : null,
        fetcher,
        {
            revalidateOnFocus: true,
            dedupingInterval: 10000,
        }
    );

    // --- Initial Load ---
    const loadData = useCallback(async () => {
        setIsLoading(true);

        // 1. Initial load from LocalStorage (fast cache)
        const localIdx = historyManager.getIndex();
        setIndex(localIdx);

        // preferences
        const prefsRaw = localStorage.getItem('recuvix_history_preferences');
        if (prefsRaw) {
            try {
                const prefs = JSON.parse(prefsRaw);
                if (prefs.viewMode) setViewMode(prefs.viewMode);
                if (prefs.defaultSort) setSortBy(prefs.defaultSort);
            } catch (e) {
                console.error('Failed to load history preferences', e);
            }
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (supabaseIdx) {
            setIndex(supabaseIdx);
            setIsLoading(false);
            setSupabaseReady(true);
        } else if (supabaseError) {
            console.error('Failed to sync history with Supabase', supabaseError);
            setIsLoading(false);
        }
    }, [supabaseIdx, supabaseError]);

    // --- Realtime Sync ---
    useEffect(() => {
        if (!user) return;

        const supabase = createClient();
        const channel = supabase
            .channel('history-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'blogs',
                    filter: workspaceId ? `workspace_id=eq.${workspaceId}` : `user_id=eq.${user.id}`,
                },
                () => {
                    // Re-fetch index on any change
                    loadData();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, loadData, workspaceId]);

    // --- Derived State ---
    const filteredEntries = useMemo(() => {
        let result = filterEntries(index, activeFilters, searchQuery);
        return sortEntries(result, sortBy);
    }, [index, activeFilters, searchQuery, sortBy]);

    const storageUsage = useMemo(() => {
        return getHistoryStorageStats(index);
    }, [index]);

    const allTags = useMemo(() => {
        return historyManager.getAllTags();
    }, [index]);

    const uniqueCountries = useMemo(() => {
        return Array.from(new Set(index.map(e => e.country)));
    }, [index]);

    const uniqueModels = useMemo(() => {
        return Array.from(new Set(index.map(e => e.model)));
    }, [index]);

    const totalWords = useMemo(() => {
        return index.reduce((acc, curr) => acc + curr.wordCount, 0);
    }, [index]);

    // --- Actions ---
    const refreshIndex = useCallback(() => {
        setIndex(historyManager.getIndex());
    }, []);

    const setFilter = (updates: Partial<FilterState>) => {
        setActiveFilters(prev => ({ ...prev, ...updates }));
    };

    const clearFilters = () => {
        setActiveFilters({
            starred: false,
            published: false,
            countries: [],
            models: [],
            tags: [],
            wordCountMin: 0,
            wordCountMax: 5000,
            dateRange: 'all'
        });
        setSearchQuery('');
    };

    const toggleStar = async (id: string) => {
        const entry = index.find(e => e.id === id);
        if (!entry) return;

        const newState = !entry.isStarred;

        // Optimistic UI update
        setIndex(prev => prev.map(e => e.id === id ? { ...e, isStarred: newState } : e));

        // Sync to services
        historyManager.toggleStar(id);

        if (user) {
            try {
                await blogsService.toggleStar(id, !newState); // toggleStar(id, currentVal) -> sets to !currentVal
            } catch (err) {
                console.error('Failed to sync star status', err);
                toast.error('Sync failed: Star status might not be saved to cloud');
            }
        }
    };

    const deleteEntry = async (id: string) => {
        // Optimistic UI
        setIndex(prev => prev.filter(e => e.id !== id));
        setSelectedIds(prev => prev.filter(item => item !== id));

        historyManager.deleteEntry(id);

        if (user) {
            try {
                await blogsService.delete(id);
            } catch (err) {
                console.error('Failed to delete blog from Supabase', err);
            }
        }

        toast.success('Blog deleted from history');
    };

    const deleteSelected = async () => {
        if (selectedIds.length === 0) return;

        const idsToDelete = [...selectedIds];

        // Optimistic UI
        setIndex(prev => prev.filter(e => !idsToDelete.includes(e.id)));
        setSelectedIds([]);

        historyManager.deleteEntries(idsToDelete);

        if (user) {
            try {
                await blogsService.deleteMany(idsToDelete);
            } catch (err) {
                console.error('Failed to delete bulk from Supabase', err);
            }
        }

        toast.success(`${idsToDelete.length} blogs deleted`);
    };

    const starSelected = async () => {
        if (selectedIds.length === 0) return;

        const idsToStar = selectedIds.filter(id => {
            const entry = index.find(e => e.id === id);
            return entry && !entry.isStarred;
        });

        if (idsToStar.length === 0) return;

        // Optimistic UI
        setIndex(prev => prev.map(e => idsToStar.includes(e.id) ? { ...e, isStarred: true } : e));

        idsToStar.forEach(id => {
            historyManager.toggleStar(id);
            if (user) {
                blogsService.toggleStar(id, false); // false = current, will set to true
            }
        });

        toast.success(`${idsToStar.length} blogs starred`);
    };

    const selectEntry = (id: string) => {
        setSelectedIds(prev => [...prev, id]);
    };

    const deselectEntry = (id: string) => {
        setSelectedIds(prev => prev.filter(item => item !== id));
    };

    const selectAll = () => {
        setSelectedIds(filteredEntries.map(e => e.id));
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    const isSelected = (id: string) => selectedIds.includes(id);

    const openBlog = async (id: string) => {
        let content = historyManager.getContent(id);

        if (!content && user) {
            // Try fetching from Supabase if not in local cache
            const row = await blogsService.getById(id);
            if (row) {
                content = mapSupabaseToHistoryContent(row);
            }
        }

        if (!content) {
            toast.error('Could not load blog content');
            return;
        }

        // Update last viewed
        historyManager.markViewed(id);
        if (user) {
            blogsService.markViewed(id);
        }

        // Save to active blog storage
        localStorage.setItem('recuvix_current_blog', JSON.stringify(content));
        localStorage.setItem('recuvix_current_history_id', id);

        // For backward compatibility
        const entry = index.find(e => e.id === id);
        if (entry) {
            localStorage.setItem('recuvix_last_output', JSON.stringify(entry));
        }

        router.push('/results?from=history');
    };

    const downloadBlog = async (id: string, format: 'html' | 'md' | 'xml' | 'zip') => {
        const entry = index.find(e => e.id === id);
        const content = historyManager.getContent(id);

        if (!entry || !content) {
            toast.error('Failed to prepare download');
            return;
        }

        const { blogHtml, blogMarkdown, seoMeta } = content;
        const slug = (seoMeta?.metaTitle || entry.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');

        if (format === 'zip') {
            await historyExporter.exportToZip([{
                title: entry.title,
                slug,
                html: blogHtml,
                markdown: blogMarkdown,
                meta: seoMeta
            }]);
        } else {
            let fileContent = '';
            let mimeType = '';
            let extension = '';

            if (format === 'html') {
                fileContent = blogHtml;
                mimeType = 'text/html';
                extension = 'html';
            } else if (format === 'md') {
                fileContent = blogMarkdown;
                mimeType = 'text/markdown';
                extension = 'md';
            } else if (format === 'xml') {
                // Simple XML wrapper
                fileContent = `<?xml version="1.0" encoding="UTF-8"?>\n<blog>\n  <title>${entry.title}</title>\n  <content>${blogHtml}</content>\n</blog>`;
                mimeType = 'application/xml';
                extension = 'xml';
            }

            const blob = new Blob([fileContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${slug}.${extension}`;
            link.click();
            URL.revokeObjectURL(url);
        }

        toast.success(`Started ${format.toUpperCase()} download`);
    };

    const downloadSelected = async () => {
        const blogsToExport = selectedIds.map(id => {
            const entry = index.find(e => e.id === id);
            const content = historyManager.getContent(id);
            if (!entry || !content) return null;

            const slug = (content.seoMeta?.metaTitle || entry.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return {
                title: entry.title,
                slug,
                html: content.blogHtml,
                markdown: content.blogMarkdown,
                meta: content.seoMeta
            };
        }).filter(b => b !== null) as any[];

        if (blogsToExport.length === 0) return;

        await historyExporter.exportToZip(blogsToExport, `recuvix-bulk-export-${selectedIds.length}-blogs.zip`);
        toast.success(`Exported ${blogsToExport.length} blogs to ZIP`);
    };

    const addTag = async (id: string, tag: string) => {
        const entry = index.find(e => e.id === id);
        if (!entry) return;

        if (!entry.tags.includes(tag)) {
            const newTags = [...entry.tags, tag];

            // Optimistic UI
            setIndex(prev => prev.map(e => e.id === id ? { ...e, tags: newTags } : e));

            historyManager.addTag(id, tag);

            if (user) {
                try {
                    await blogsService.updateTags(id, newTags);
                } catch (err) {
                    console.error('Failed to sync tag', err);
                }
            }
        }
    };

    const removeTag = async (id: string, tag: string) => {
        const entry = index.find(e => e.id === id);
        if (!entry) return;

        const newTags = entry.tags.filter(t => t !== tag);

        // Optimistic UI
        setIndex(prev => prev.map(e => e.id === id ? { ...e, tags: newTags } : e));

        historyManager.removeTag(id, tag);

        if (user) {
            try {
                await blogsService.updateTags(id, newTags);
            } catch (err) {
                console.error('Failed to remove tag sync', err);
            }
        }
    };

    const regenerateBlog = async (id: string) => {
        let content = historyManager.getContent(id);

        if (!content && user) {
            const row = await blogsService.getById(id);
            if (row) {
                content = mapSupabaseToHistoryContent(row);
            }
        }

        if (!content) {
            toast.error('Failed to load generation data');
            return;
        }

        const { generationInput } = content;
        localStorage.setItem('recuvix_history_prefill', JSON.stringify({
            ...generationInput,
            sourceTitle: content.seoMeta?.metaTitle || index.find(e => e.id === id)?.title
        }));

        router.push('/');
    };

    const clearNonStarred = () => {
        historyManager.clearNonStarred();
        refreshIndex();
        toast.success('Cleaned up non-starred blogs');
    };

    const clearAll = () => {
        historyManager.clearAll();
        refreshIndex();
        toast.success('History cleared');
    };

    const exportAll = async () => {
        const allBlogs = index.map(entry => {
            const content = historyManager.getContent(entry.id);
            if (!content) return null;
            const slug = (content.seoMeta?.metaTitle || entry.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return {
                title: entry.title,
                slug,
                html: content.blogHtml,
                markdown: content.blogMarkdown,
                meta: content.seoMeta
            };
        }).filter(b => b !== null) as any[];

        if (allBlogs.length === 0) {
            toast.error('No blogs to export');
            return;
        }

        await historyExporter.exportToZip(allBlogs, `recuvix-full-history-export.zip`);
    };

    // --- Preference Persistence ---
    useEffect(() => {
        const prefs = {
            viewMode,
            defaultSort: sortBy
        };
        localStorage.setItem('recuvix_history_preferences', JSON.stringify(prefs));
    }, [viewMode, sortBy]);

    return {
        index,
        filteredEntries,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        activeFilters,
        setFilter,
        clearFilters,
        selectedIds,
        viewMode,
        setViewMode,
        isLoading,
        storageUsage,
        allTags,
        uniqueCountries,
        uniqueModels,
        totalWords,

        // Selection
        selectEntry,
        deselectEntry,
        selectAll,
        clearSelection,
        isSelected,

        // Actions
        openBlog,
        downloadBlog,
        toggleStar,
        deleteEntry,
        addTag,
        removeTag,
        regenerateBlog,

        // Bulk
        deleteSelected,
        starSelected,
        downloadSelected,

        // Space mgmt
        clearNonStarred,
        clearAll,
        exportAll,
        refreshIndex
    };
};
