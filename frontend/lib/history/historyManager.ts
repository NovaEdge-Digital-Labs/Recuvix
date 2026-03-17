import { nanoid } from 'nanoid';
import { HistoryIndexEntry } from './historySearch';
import { extractExcerpt } from './excerptExtractor';

const STORAGE_KEYS = {
    INDEX: 'recuvix_history_index',
    CONTENT_PREFIX: 'recuvix_history_content_',
    PREFERENCES: 'recuvix_history_preferences'
};

export interface HistoryContent {
    id: string;
    blogHtml: string;
    blogMarkdown: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seoMeta: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationInput: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editHistory: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    approvedOutline: any | null;
}

export interface SaveHistoryInput {
    title: string;
    topic: string;
    focusKeyword: string;
    country: string;
    wordCount: number;
    format: string;
    model: string;
    blogHtml: string;
    blogMarkdown: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seoMeta: any;
    thumbnailUrl?: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationInput: any;
    generationTime?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    approvedOutline?: any;
    calendarEntryId?: string;
    source?: 'standard' | 'voice' | 'repurpose';
}

export const historyManager = {
    /**
     * Save a new blog to history
     */
    saveToHistory(data: SaveHistoryInput): string {
        const id = nanoid();
        const storageKey = `${STORAGE_KEYS.CONTENT_PREFIX}${id}`;
        const excerpt = extractExcerpt(data.blogHtml);

        const indexEntry: HistoryIndexEntry = {
            id,
            title: data.title,
            topic: data.topic,
            focusKeyword: data.focusKeyword,
            country: data.country,
            wordCount: data.wordCount,
            format: data.format as "html" | "md" | "xml",
            model: data.model,
            createdAt: new Date().toISOString(),
            lastViewedAt: new Date().toISOString(),
            isStarred: false,
            tags: [],
            thumbnailUrl: data.thumbnailUrl || null,
            metaTitle: data.seoMeta?.metaTitle || data.title,
            metaDescription: data.seoMeta?.metaDescription || '',
            hasWordPressPost: false,
            wordPressUrl: null,
            editCount: 0,
            generationTime: data.generationTime || 0,
            storageKey,
            excerpt,
            calendarEntryId: data.calendarEntryId,
            source: data.source || 'standard'
        };

        // 1. Prune if needed (max 50)
        this._pruneIfNecessary();

        // 2. Save content
        const content: HistoryContent = {
            id,
            blogHtml: data.blogHtml,
            blogMarkdown: data.blogMarkdown,
            seoMeta: data.seoMeta,
            generationInput: data.generationInput,
            editHistory: [],
            approvedOutline: data.approvedOutline || null
        };

        try {
            localStorage.setItem(storageKey, JSON.stringify(content));

            // 3. Update index
            const index = this.getIndex();
            index.unshift(indexEntry);
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index.slice(0, 50)));

            // 4. Verify quota and prune more if needed
            this._verifyQuota();

            return id;
        } catch (e) {
            console.error('Failed to save to history', e);
            // Try emergency pruning and retry once
            this._emergencyPrune();
            localStorage.setItem(storageKey, JSON.stringify(content));
            const index = this.getIndex();
            index.unshift(indexEntry);
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index.slice(0, 50)));
            return id;
        }
    },

    /**
     * Update existing entry
     */
    updateEntry(id: string, updates: Partial<HistoryIndexEntry> & {
        blogHtml?: string;
        blogMarkdown?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        seoMeta?: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editHistory?: any[];
    }) {
        const index = this.getIndex();
        const entryIndex = index.findIndex(e => e.id === id);
        if (entryIndex === -1) return;

        // Update index entry
        const entry = index[entryIndex];
        const updatedEntry = { ...entry, ...updates };

        // If HTML changed, update excerpt and word count
        if (updates.blogHtml) {
            updatedEntry.excerpt = extractExcerpt(updates.blogHtml);
        }

        index[entryIndex] = updatedEntry;
        localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));

        // Update content if provided
        if (updates.blogHtml || updates.blogMarkdown || updates.seoMeta || updates.editHistory) {
            const content = this.getContent(id);
            if (content) {
                if (updates.blogHtml) content.blogHtml = updates.blogHtml;
                if (updates.blogMarkdown) content.blogMarkdown = updates.blogMarkdown;
                if (updates.seoMeta) content.seoMeta = updates.seoMeta;
                if (updates.editHistory) content.editHistory = updates.editHistory;
                localStorage.setItem(entry.storageKey, JSON.stringify(content));
            }
        }
    },

    getIndex(): HistoryIndexEntry[] {
        const raw = localStorage.getItem(STORAGE_KEYS.INDEX);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    },

    getContent(id: string): HistoryContent | null {
        const key = `${STORAGE_KEYS.CONTENT_PREFIX}${id}`;
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    deleteEntry(id: string) {
        const index = this.getIndex();
        const filtered = index.filter(e => e.id !== id);
        localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(filtered));
        localStorage.removeItem(`${STORAGE_KEYS.CONTENT_PREFIX}${id}`);
    },

    deleteEntries(ids: string[]) {
        ids.forEach(id => this.deleteEntry(id));
    },

    toggleStar(id: string) {
        const index = this.getIndex();
        const entry = index.find(e => e.id === id);
        if (entry) {
            entry.isStarred = !entry.isStarred;
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
        }
    },

    addTag(id: string, tag: string) {
        const index = this.getIndex();
        const entry = index.find(e => e.id === id);
        if (entry && !entry.tags.includes(tag)) {
            entry.tags.push(tag);
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
        }
    },

    removeTag(id: string, tag: string) {
        const index = this.getIndex();
        const entry = index.find(e => e.id === id);
        if (entry) {
            entry.tags = entry.tags.filter(t => t !== tag);
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
        }
    },

    markViewed(id: string) {
        const index = this.getIndex();
        const entry = index.find(e => e.id === id);
        if (entry) {
            entry.lastViewedAt = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
        }
    },

    getAllTags(): string[] {
        const index = this.getIndex();
        const tags = new Set<string>();
        index.forEach(e => e.tags.forEach(t => tags.add(t)));
        return Array.from(tags);
    },

    clearNonStarred() {
        const index = this.getIndex();
        const starred = index.filter(e => e.isStarred);
        const nonStarred = index.filter(e => !e.isStarred);

        nonStarred.forEach(e => localStorage.removeItem(e.storageKey));
        localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(starred));
    },

    clearAll() {
        const index = this.getIndex();
        index.forEach(e => localStorage.removeItem(e.storageKey));
        localStorage.removeItem(STORAGE_KEYS.INDEX);
    },

    // Internal helpers
    _pruneIfNecessary() {
        const index = this.getIndex();
        if (index.length >= 50) {
            // Find oldest non-starred
            const toPrune = [...index]
                .reverse()
                .find(e => !e.isStarred);

            if (toPrune) {
                this.deleteEntry(toPrune.id);
            }
        }
    },

    _verifyQuota() {
        try {
            const testKey = 'recuvix_quota_test';
            localStorage.setItem(testKey, 'x');
            localStorage.removeItem(testKey);
        } catch {
            this._emergencyPrune();
        }
    },

    _emergencyPrune() {
        console.warn('LocalStorage quota exceeded. Pruning history...');
        const index = this.getIndex();
        const unstarred = index.filter(e => !e.isStarred);

        // Delete oldest 5 unstarred
        const toDelete = unstarred.slice(-5);
        toDelete.forEach(e => this.deleteEntry(e.id));

        // Note: In a real app, we'd trigger a toast here, 
        // but manager doesn't have UI access. 
        // Hook will handle this.
    }
};
