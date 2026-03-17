export type ResearchTopic = {
    id: string;
    title: string;                 // the blog topic/title
    focusKeyword: string;          // primary keyword to target
    secondaryKeywords: string[];   // 3-5 related keywords
    searchVolumeRange: string;     // e.g. "1K-10K/month"
    searchVolumeSource: "ai_estimate" | "dataforseo";
    difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
    difficultyScore: number;       // 0-100
    intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
    estimatedTrafficPotential: "Low" | "Medium" | "High" | "Very High";
    angle: string;                 // what unique angle to take
    whyItWillRank: string;         // 1 sentence reason
    contentType: "Listicle" | "How-To Guide" | "Comparison" |
    "Case Study" | "Ultimate Guide" | "News/Trend";
    estimatedWordCount: number;    // suggested word count
    competitorCount: "Few" | "Moderate" | "Many";
    countryRelevance: string;      // why relevant to target country
    selected: boolean;             // user has picked this topic
};

export interface ResearchHistory {
    id: string;
    niche: string;
    country: string;
    topics: ResearchTopic[];
    researchedAt: string;
    model: string;
}

export interface DataForSeoConfig {
    login: string;
    password: string;
    connected: boolean;
    connectedAt: string;
}
