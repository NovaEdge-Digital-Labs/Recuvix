import React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, ChevronDown, Check } from "lucide-react";
import { LANGUAGES } from "@/lib/config/languageConfig";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
    currentLanguageCode: string;
    availableLanguageCodes: string[];
    onLanguageChange: (code: string) => void;
}

export function LanguageSwitcher({
    currentLanguageCode,
    availableLanguageCodes,
    onLanguageChange,
}: LanguageSwitcherProps) {
    const currentLang = LANGUAGES.find((l) => l.code === currentLanguageCode) || LANGUAGES[0];
    const availableLangs = LANGUAGES.filter((l) => availableLanguageCodes.includes(l.code));

    if (availableLangs.length <= 1) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2 bg-background border-primary/20 hover:border-primary/40 transition-all shadow-sm">
                    <Languages className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">{currentLang.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-1.5 rounded-xl">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2 py-1.5">
                        Switch Version
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {availableLangs.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => onLanguageChange(lang.code)}
                        className={cn(
                            "flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition-colors",
                            currentLanguageCode === lang.code ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{lang.flag}</span>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold leading-none">{lang.name}</span>
                                <span className="text-[9px] text-muted-foreground uppercase opacity-70 mt-1">{lang.nativeName}</span>
                            </div>
                        </div>
                        {currentLanguageCode === lang.code && <Check className="w-3.5 h-3.5" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
