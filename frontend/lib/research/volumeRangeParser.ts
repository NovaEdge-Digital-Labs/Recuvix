export function parseVolumeRange(range: string): number {
    if (range.includes(">")) return 100001;
    if (range.includes("<")) return 1;

    // Pattern "100-1K" or "1K-10K"
    const parts = range.split("/")[0].split("-");
    if (parts.length < 1) return 0;

    const parsePart = (p: string) => {
        p = p.toUpperCase().trim();
        if (p.endsWith("K")) return parseFloat(p) * 1000;
        if (p.endsWith("M")) return parseFloat(p) * 1000000;
        return parseFloat(p) || 0;
    };

    // Return the average or just the lower bound for sorting
    return parsePart(parts[0]);
}
