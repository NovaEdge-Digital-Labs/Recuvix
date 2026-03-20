"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AIModel } from "@/lib/types";

export interface ApiConfig {
    selectedModel: AIModel | null;
    apiKey: string | null;
    savedAt: number | null;
}

export interface DataForSeoConfig {
    login: string | null;
    password: string | null; // Encoded
    isActive: boolean;
}

export interface Preferences {
    includeAiImages: boolean;
    includeStockImages: boolean;
    theme: "dark" | "light";
    showOutlinePreview: boolean;
    defaultCountry?: string;
    defaultTone?: string;
    defaultWordCount?: number;
}

export interface LastOutput {
    blogHtml: string;
    blogMarkdown: string;
    thumbnailUrl: string;
    seoMeta: object;
    generatedAt: number;
    topic: string;
}

interface AppContextType {
    apiConfig: ApiConfig;
    setApiConfig: (config: ApiConfig) => void;
    updateApiConfig: (config: Partial<ApiConfig>) => void;
    preferences: Preferences;
    setPreferences: (prefs: Preferences) => void;
    updatePreferences: (prefs: Partial<Preferences>) => void;
    lastOutput: LastOutput | null;
    setLastOutput: (output: LastOutput | null) => void;
    dataForSeoConfig: DataForSeoConfig;
    setDataForSeoConfig: (config: DataForSeoConfig) => void;
    isHydrated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    console.log("AppProvider render, isHydrated:", isHydrated);

    const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig>("recuvix_api_config", {
        selectedModel: null,
        apiKey: null,
        savedAt: null,
    });

    const [preferences, setPreferences] = useLocalStorage<Preferences>("recuvix_preferences", {
        includeAiImages: true,
        includeStockImages: true,
        theme: "dark",
        showOutlinePreview: true,
    });

    const [lastOutput, setLastOutput] = useLocalStorage<LastOutput | null>("recuvix_last_output", null);

    const [dataForSeoConfig, setDataForSeoConfig] = useLocalStorage<DataForSeoConfig>("recuvix_dataforseo_config", {
        login: null,
        password: null,
        isActive: false,
    });

    const updateApiConfig = (newConfig: Partial<ApiConfig>) => {
        setApiConfig(prev => ({ ...prev, ...newConfig, savedAt: Date.now() }));
    };

    const updatePreferences = (newPrefs: Partial<Preferences>) => {
        setPreferences(prev => ({ ...prev, ...newPrefs }));
    };

    useEffect(() => {
        console.log("AppProvider setting isHydrated to true");
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (preferences.theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [preferences.theme]);

    // We let hydration happen naturally to avoid blank screens

    return (
        <AppContext.Provider value={{
            apiConfig, setApiConfig, updateApiConfig,
            preferences, setPreferences, updatePreferences,
            lastOutput, setLastOutput,
            dataForSeoConfig, setDataForSeoConfig,
            isHydrated
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
