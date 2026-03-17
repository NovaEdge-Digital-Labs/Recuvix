/**
 * Snapshot Manager
 * Handles localStorage read/write for GSC ranking snapshots
 */

export interface GSCKeywordSnapshot {
    date: string; // ISO date of snapshot
    keyword: string;
    position: number;
    impressions: number;
    clicks: number;
    ctr: number;
    url: string;
}

export type SnapshotsByBlog = Record<string, GSCKeywordSnapshot[]>;

const SNAPSHOTS_KEY = "recuvix_ranking_snapshots";
const MAX_SNAPSHOTS_PER_BLOG = 90;

export function getSnapshots(blogId: string): GSCKeywordSnapshot[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(SNAPSHOTS_KEY);
    if (!stored) return [];
    try {
        const data: SnapshotsByBlog = JSON.parse(stored);
        return data[blogId] || [];
    } catch (e) {
        console.error("Failed to parse snapshots", e);
        return [];
    }
}

export function saveSnapshot(blogId: string, snapshots: GSCKeywordSnapshot[]) {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(SNAPSHOTS_KEY);
    let data: SnapshotsByBlog = {};
    if (stored) {
        try {
            data = JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse existing snapshots", e);
        }
    }

    const existing = data[blogId] || [];

    // Merge new snapshots with existing, avoiding duplicates for the same date/keyword
    // In our case, a "snapshot" call usually returns many keywords for ONE date.
    // We'll just append them.
    const updated = [...existing, ...snapshots];

    // Simple pruning: group by date, and keep only the latest MAX_SNAPSHOT_PER_BLOG dates
    const dates = Array.from(new Set(updated.map(s => s.date))).sort((a, b) => b.localeCompare(a));
    const keepDates = dates.slice(0, MAX_SNAPSHOTS_PER_BLOG);

    data[blogId] = updated.filter(s => keepDates.includes(s.date));

    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(data));
}

export function getLatestSnapshot(blogId: string): GSCKeywordSnapshot[] {
    const all = getSnapshots(blogId);
    if (all.length === 0) return [];

    const latestDate = all.reduce((latest, current) => {
        return current.date > latest ? current.date : latest;
    }, all[0].date);

    return all.filter(s => s.date === latestDate);
}

export function clearSnapshots(blogId: string) {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(SNAPSHOTS_KEY);
    if (!stored) return;
    try {
        const data: SnapshotsByBlog = JSON.parse(stored);
        delete data[blogId];
        localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(data));
    } catch { }
}
