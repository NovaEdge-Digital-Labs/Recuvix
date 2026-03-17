import { ResearchTopic } from "@/lib/types/research";

export type FilterOption = "all" | "Listicle" | "How-To Guide" | "Comparison" | "Case Study" | "Ultimate Guide" | "News/Trend";

export function filterTopics(topics: ResearchTopic[], option: FilterOption): ResearchTopic[] {
    if (option === "all") return topics;
    return topics.filter(t => t.contentType === option);
}
