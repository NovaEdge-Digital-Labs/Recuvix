import { ResearchTopic } from "@/lib/types/research";
import { parseVolumeRange } from "./volumeRangeParser";

export type SortOption = "relevance" | "traffic_desc" | "difficulty_asc" | "volume_desc" | "wordcount_desc";

export function sortTopics(topics: ResearchTopic[], option: SortOption): ResearchTopic[] {
    const sorted = [...topics];

    switch (option) {
        case "traffic_desc":
            const trafficMap = { "Low": 1, "Medium": 2, "High": 3, "Very High": 4 };
            return sorted.sort((a, b) => trafficMap[b.estimatedTrafficPotential] - trafficMap[a.estimatedTrafficPotential]);

        case "difficulty_asc":
            return sorted.sort((a, b) => a.difficultyScore - b.difficultyScore);

        case "volume_desc":
            return sorted.sort((a, b) => parseVolumeRange(b.searchVolumeRange) - parseVolumeRange(a.searchVolumeRange));

        case "wordcount_desc":
            return sorted.sort((a, b) => b.estimatedWordCount - a.estimatedWordCount);

        case "relevance":
        default:
            return sorted; // Assume default order is relevance (from LLM)
    }
}
