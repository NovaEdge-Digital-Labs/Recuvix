"use client";

import { useState } from "react";
import { ModelCard } from "@/components/onboarding/ModelCard";
import { ApiKeyInput } from "@/components/onboarding/ApiKeyInput";
import { AIModel } from "@/context/AppContext";

export default function OnboardingPage() {
    const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);

    const models = [
        {
            id: "claude" as AIModel,
            name: "Claude",
            description: "Most human-like writing",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: "openai" as AIModel,
            name: "ChatGPT",
            description: "Versatile and reliable",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: "gemini" as AIModel,
            name: "Gemini",
            description: "Great for research-heavy blogs",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                </svg>
            )
        },
        {
            id: "grok" as AIModel,
            name: "Grok",
            description: "Current events & trending topics",
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 22h20L12 2zm0 3.5l7.5 15h-15L12 5.5zM11 15h2v2h-2v-2zm0-6h2v5h-2V9z" fill="currentColor" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[520px] bg-card border border-border rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                        </svg>
                        Recuvix
                    </h1>
                    <p className="text-muted-foreground text-sm">Write once. Rank everywhere.</p>
                </div>

                <div>
                    <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Choose your AI model</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {models.map((model) => (
                            <ModelCard
                                key={model.id}
                                id={model.id}
                                name={model.name}
                                description={model.description}
                                icon={model.icon}
                                selected={selectedModel === model.id}
                                onSelect={(id) => setSelectedModel(id as AIModel)}
                            />
                        ))}
                    </div>
                </div>

                {selectedModel && <ApiKeyInput modelId={selectedModel} />}
            </div>
        </div>
    );
}
