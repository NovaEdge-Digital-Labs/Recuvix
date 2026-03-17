// Removed unused LanguageConfig import

export interface MultilingualSession {
    id: string;
    topic: string;
    targetLanguages: string[];
    country: string;
    createdAt: string;
    versions: Record<string, MultilingualVersion>;
}

export interface MultilingualVersion {
    status: "queued" | "generating" | "complete" | "failed";
    blogHtml: string;
    blogMarkdown: string;
    thumbnailUrl: string;
    seoMeta: Record<string, unknown>;
    wordCount: number;
    generatedAt: string;
    error?: string;
}

export interface MultilingualPreferences {
    defaultLanguages: string[];
    generateSimultaneously: boolean;
    includeHreflangPack: boolean;
}

const SESSIONS_KEY = "recuvix_multilingual_sessions";
const PREFS_KEY = "recuvix_multilingual_preferences";

export const languageQueueManager = {
    getSessions: (): MultilingualSession[] => {
        if (typeof window === "undefined") return [];
        try {
            const sessions = localStorage.getItem(SESSIONS_KEY);
            return sessions ? JSON.parse(sessions) : [];
        } catch {
            return [];
        }
    },

    saveSession: (session: MultilingualSession) => {
        if (typeof window === "undefined") return;
        try {
            const sessions = languageQueueManager.getSessions();
            const index = sessions.findIndex((s) => s.id === session.id);
            if (index !== -1) {
                sessions[index] = session;
            } else {
                sessions.unshift(session);
            }
            // Keep only last 5 sessions
            const limitedSessions = sessions.slice(0, 5);
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(limitedSessions));
        } catch (e) {
            console.error("Failed to save session", e);
        }
    },

    getSession: (id: string): MultilingualSession | null => {
        const sessions = languageQueueManager.getSessions();
        return sessions.find((s) => s.id === id) || null;
    },

    getPreferences: (): MultilingualPreferences => {
        if (typeof window === "undefined") {
            return { defaultLanguages: [], generateSimultaneously: false, includeHreflangPack: true };
        }
        try {
            const prefs = localStorage.getItem(PREFS_KEY);
            return prefs ? JSON.parse(prefs) : { defaultLanguages: [], generateSimultaneously: false, includeHreflangPack: true };
        } catch {
            return { defaultLanguages: [], generateSimultaneously: false, includeHreflangPack: true };
        }
    },

    savePreferences: (prefs: MultilingualPreferences) => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
        } catch (e) {
            console.error("Failed to save preferences", e);
        }
    },
};
