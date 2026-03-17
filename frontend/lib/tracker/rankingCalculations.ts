/**
 * Ranking Calculations
 * Utilities for computing changes and trends from snapshots
 */

import { GSCKeywordSnapshot } from "./snapshotManager";

export function calculateDelta(current: number, previous: number | null): number | null {
    if (previous === null) return null;
    // Position 1 is better than 10, so a decrease in number is an improvement.
    // Delta = Previous - Current. If > 0, improved.
    return previous - current;
}

export function getRankStatus(position: number) {
    if (position <= 3) return "top3";
    if (position <= 10) return "top10";
    if (position <= 20) return "page2";
    return "low";
}

export function getTrend(snapshots: GSCKeywordSnapshot[], keyword: string): "up" | "down" | "stable" | "unknown" {
    const keywordSnapshots = snapshots
        .filter(s => s.keyword === keyword)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (keywordSnapshots.length < 2) return "unknown";

    const current = keywordSnapshots[0].position;
    const previous = keywordSnapshots[1].position;

    if (Math.abs(current - previous) < 0.5) return "stable";
    return current < previous ? "up" : "down";
}

export function getPositionDelta(blogId: string, keyword: string, allSnapshots: GSCKeywordSnapshot[]): number | null {
    const keywordSnapshots = allSnapshots
        .filter(s => s.keyword === keyword)
        .sort((a, b) => b.date.localeCompare(a.date));

    if (keywordSnapshots.length < 2) return null;

    return keywordSnapshots[1].position - keywordSnapshots[0].position;
}
