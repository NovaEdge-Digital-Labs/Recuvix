/**
 * Utility for estimating localStorage storage usage.
 */
export const calculateStorageUsage = () => {
    let totalSize = 0;

    // Object.keys is fine for small localStorage
    for (const key in localStorage) {
        if (!Object.prototype.hasOwnProperty.call(localStorage, key)) continue;

        // Basic estimation: 2 bytes per character for UTF-16
        const value = localStorage.getItem(key) || '';
        totalSize += (key.length + value.length) * 2;
    }

    const sizeInKB = totalSize / 1024;
    const sizeInMB = sizeInKB / 1024;

    return {
        bytes: totalSize,
        kb: Math.round(sizeInKB * 10) / 10,
        mb: Math.round(sizeInMB * 100) / 100
    };
};

/**
 * Specifically for blog history items
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getHistoryStorageStats = (index: any[]) => {
    let historyBytes = 0;

    // Estimate index size
    historyBytes += JSON.stringify(index).length * 2;

    // Estimate individual content items if we can reach them
    // This is better done item by item during actual access or pruning
    // but for a quick overview we just use the index count

    return {
        totalBlogs: index.length,
        estimatedKB: Math.round((historyBytes / 1024) * 10) / 10,
        starredCount: index.filter(e => e.isStarred).length,
        availableSlots: Math.max(0, 50 - index.length)
    };
};
