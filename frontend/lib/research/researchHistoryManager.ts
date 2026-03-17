import { ResearchHistory } from "@/lib/types/research";

const HISTORY_KEY = "recuvix_research_history";
const MAX_HISTORY = 20;

export function getResearchHistory(): ResearchHistory[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveToHistory(historyItem: ResearchHistory): void {
    if (typeof window === "undefined") return;
    const history = getResearchHistory();
    const updated = [historyItem, ...history.filter(h => h.id !== historyItem.id)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function deleteFromHistory(id: string): void {
    if (typeof window === "undefined") return;
    const history = getResearchHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(HISTORY_KEY);
}
