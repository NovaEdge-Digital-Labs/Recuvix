import { BulkTopic, BulkSettings } from "@/lib/validators/bulkSchemas";

export interface BulkJobEstimate {
    estimatedSeconds: number;
    estimatedWords: number;
    estimatedApiCalls: number;
    estimatedCostUsd: number;
    timeLabel: "Quick" | "Medium" | "Long run" | "Overnight run";
}

export function estimateBulkJob(topics: BulkTopic[], settings: BulkSettings): BulkJobEstimate {
    let totalSeconds = 0;
    let totalWords = 0;
    let apiCalls = 0;

    const count = topics.length;

    topics.forEach(topic => {
        // Base time per blog: 90 seconds (writing)
        let seconds = 90;
        let calls = 1;

        // Add 15s if outline enabled
        if (settings.includeOutlinePreview && !topic.approvedOutline) {
            seconds += 15;
            calls += 1;
        }

        // Add 10s if images enabled
        if (settings.includeAiImages || settings.includeStockImages) {
            seconds += 15; // API calls for images can be slow
            calls += 1;
        }

        // Add 15s if thumbnail enabled
        if (settings.includeThumbnail) {
            seconds += 20;
            calls += 1;
        }

        // Add 5s if SEO pack
        if (settings.includeSeoPack) {
            seconds += 10;
            calls += 1;
        }

        totalSeconds += seconds;
        totalWords += topic.wordCount || settings.wordCount;
        apiCalls += calls;
    });

    // Add delays between blogs
    if (count > 1) {
        totalSeconds += (count - 1) * settings.delayBetweenBlogs;
    }

    // Cost estimate: ~$0.002 per 1000 tokens (conservative avg)
    // ~750 tokens per 500 words
    const estimatedTokens = (totalWords / 500) * 1000;
    const estimatedCostUsd = (estimatedTokens / 1000) * 0.005; // Slightly higher to be safe

    let timeLabel: BulkJobEstimate["timeLabel"] = "Quick";
    if (totalSeconds > 3600) {
        timeLabel = "Overnight run";
    } else if (totalSeconds > 1800) {
        timeLabel = "Long run";
    } else if (totalSeconds > 600) {
        timeLabel = "Medium";
    }

    return {
        estimatedSeconds: totalSeconds,
        estimatedWords: totalWords,
        estimatedApiCalls: apiCalls,
        estimatedCostUsd: Math.max(0.01, Number(estimatedCostUsd.toFixed(2))),
        timeLabel
    };
}
