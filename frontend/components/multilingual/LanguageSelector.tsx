import React, { useCallback } from "react";
import { LANGUAGES } from "@/lib/config/languageConfig";
import { LanguageCard } from "./LanguageCard";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface LanguageSelectorProps {
    selectedLanguages: string[];
    onChange: (languages: string[]) => void;
}

export function LanguageSelector({ selectedLanguages, onChange }: LanguageSelectorProps) {
    const toggleLanguage = useCallback((code: string) => {
        if (code === "en") return; // English is mandatory

        if (selectedLanguages.includes(code)) {
            onChange(selectedLanguages.filter(l => l !== code));
        } else {
            onChange([...selectedLanguages, code]);
        }
    }, [selectedLanguages, onChange]);

    const quickSelect = (type: 'all' | 'asian' | 'european' | 'clear') => {
        switch (type) {
            case 'all':
                onChange(LANGUAGES.map(l => l.code));
                break;
            case 'asian':
                onChange(['en', 'ja', 'zh', 'ko', 'hi']);
                break;
            case 'european':
                onChange(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru']);
                break;
            case 'clear':
                onChange(['en']);
                break;
        }
    };

    const selectedCount = selectedLanguages.length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-widest">
                    Select languages to generate
                </h3>
                <p className="text-xs text-muted-foreground">
                    English will always be included. Select additional languages for localized generation.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {LANGUAGES.map((lang) => (
                    <LanguageCard
                        key={lang.code}
                        language={lang}
                        selected={selectedLanguages.includes(lang.code)}
                        disabled={lang.code === "en"}
                        onSelect={toggleLanguage}
                    />
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-muted/50">
                <span className="text-xs font-medium text-muted-foreground mr-2">Quick select:</span>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold px-3 rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    onClick={() => quickSelect('all')}
                >
                    All
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold px-3 rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    onClick={() => quickSelect('asian')}
                >
                    Asian
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold px-3 rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    onClick={() => quickSelect('european')}
                >
                    European
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold px-3 rounded-full hover:text-destructive"
                    onClick={() => quickSelect('clear')}
                >
                    Clear all
                </Button>
            </div>

            {selectedCount >= 3 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                        <p className="font-bold uppercase tracking-tight">API Infrastructure Notice</p>
                        <p className="leading-relaxed">
                            Generating <strong>{selectedCount} languages</strong> will initiate {selectedCount} separate AI calls.
                            Each uses your API credits. <span className="opacity-80">Estimated time: ~{selectedCount * 30}s</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
