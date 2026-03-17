/**
 * Search, sort, and filter logic for blog history.
 */

export interface HistoryIndexEntry {
    id: string;
    title: string;
    topic: string;
    focusKeyword: string;
    country: string;
    wordCount: number;
    format: "html" | "md" | "xml";
    model: string;
    createdAt: string;
    lastViewedAt: string;
    isStarred: boolean;
    tags: string[];
    thumbnailUrl: string | null;
    metaTitle: string;
    metaDescription: string;
    hasWordPressPost: boolean;
    wordPressUrl: string | null;
    editCount: number;
    generationTime: number;
    storageKey: string;
    excerpt: string;
    calendarEntryId?: string;
    source?: 'standard' | 'voice' | 'repurpose';
}

export type SortOption = "newest" | "oldest" | "az" | "za" | "most_words" | "recently_viewed";

export interface FilterState {
    starred: boolean;
    published: boolean;
    countries: string[];
    models: string[];
    tags: string[];
    wordCountMin: number;
    wordCountMax: number;
    dateRange: "today" | "week" | "month" | "all";
}

export const sortEntries = (entries: HistoryIndexEntry[], by: SortOption): HistoryIndexEntry[] => {
    const sorted = [...entries];

    switch (by) {
        case "newest":
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        case "oldest":
            return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case "az":
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case "za":
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case "most_words":
            return sorted.sort((a, b) => b.wordCount - a.wordCount);
        case "recently_viewed":
            return sorted.sort((a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime());
        default:
            return sorted;
    }
};

export const filterEntries = (
    entries: HistoryIndexEntry[],
    filters: Partial<FilterState>,
    searchQuery: string = ''
): HistoryIndexEntry[] => {
    let filtered = [...entries];

    // 1. Search Query
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(e =>
            e.title.toLowerCase().includes(q) ||
            e.topic.toLowerCase().includes(q) ||
            e.focusKeyword.toLowerCase().includes(q) ||
            e.excerpt.toLowerCase().includes(q) ||
            e.tags.some(t => t.toLowerCase().includes(q)) ||
            e.country.toLowerCase().includes(q) ||
            e.source?.toLowerCase().includes(q)
        );
    }

    // 2. Starred
    if (filters.starred) {
        filtered = filtered.filter(e => e.isStarred);
    }

    // 3. Published
    if (filters.published) {
        filtered = filtered.filter(e => e.hasWordPressPost);
    }

    // 4. Countries
    if (filters.countries && filters.countries.length > 0) {
        filtered = filtered.filter(e => filters.countries!.includes(e.country));
    }

    // 5. Models
    if (filters.models && filters.models.length > 0) {
        filtered = filtered.filter(e => filters.models!.includes(e.model));
    }

    // 6. Tags
    if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(e => filters.tags!.every(t => e.tags.includes(t)));
    }

    // 7. Word Count
    if (filters.wordCountMin !== undefined) {
        filtered = filtered.filter(e => e.wordCount >= filters.wordCountMin!);
    }
    if (filters.wordCountMax !== undefined) {
        filtered = filtered.filter(e => e.wordCount <= filters.wordCountMax!);
    }

    // 8. Date Range
    if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        filtered = filtered.filter(e => {
            const created = new Date(e.createdAt).getTime();
            switch (filters.dateRange) {
                case 'today':
                    return created >= startOfDay;
                case 'week':
                    return created >= startOfDay - (7 * 24 * 60 * 60 * 1000);
                case 'month':
                    return created >= startOfDay - (30 * 24 * 60 * 60 * 1000);
                default:
                    return true;
            }
        });
    }

    return filtered;
};
