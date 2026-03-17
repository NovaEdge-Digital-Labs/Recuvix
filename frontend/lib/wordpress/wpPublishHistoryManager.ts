import { WPConnection, WPPublishHistory } from "./wpTypes";

const CONNECTIONS_KEY = "recuvix_wp_connections";
const HISTORY_KEY = "recuvix_wp_publish_history";

/**
 * LocalStorage manager for WordPress data.
 * Used on the client side.
 */
export const wpPublishHistoryManager = {
    // --- Connections ---
    getConnections(): WPConnection[] {
        if (typeof window === "undefined") return [];
        try {
            const data = localStorage.getItem(CONNECTIONS_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    saveConnections(connections: WPConnection[]) {
        if (typeof window === "undefined") return;
        localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections.slice(0, 5)));
    },

    // --- History ---
    getHistory(): WPPublishHistory[] {
        if (typeof window === "undefined") return [];
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    addHistoryItem(item: WPPublishHistory) {
        if (typeof window === "undefined") return;
        const history = wpPublishHistoryManager.getHistory();
        const updated = [item, ...history].slice(0, 20); // Keep last 20
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    },

    getHistoryForBlog(title: string): WPPublishHistory | null {
        const history = wpPublishHistoryManager.getHistory();
        return history.find((h) => h.blogTitle === title) || null;
    },
};
