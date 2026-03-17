import React, { useMemo } from "react";
import { LanguageConfig } from "@/lib/config/languageConfig";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";

interface LanguagePreviewPanelProps {
    language: LanguageConfig;
    status: "queued" | "generating" | "complete" | "failed";
    content: string;
    error?: string | null;
}

export function LanguagePreviewPanel({ language, status, content, error }: LanguagePreviewPanelProps) {
    const isRTL = language.direction === "rtl";
    const isCJK = ["cjk", "hangul"].includes(language.script);

    const containerStyles = useMemo(() => {
        return cn(
            "w-full h-full overflow-y-auto p-8 md:p-12 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-inner",
            isRTL ? "direction-rtl text-right font-arabic" : "direction-ltr text-left",
        );
    }, [isRTL]);

    const innerStyles = useMemo(() => {
        return {
            fontFamily: language.fontStack,
            lineHeight: isCJK ? 1.9 : isRTL ? 1.8 : 1.75,
            fontSize: isCJK ? "17px" : "16px",
        };
    }, [language.fontStack, isCJK, isRTL]);

    if (status === "queued") {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground space-y-4 bg-muted/5 rounded-xl border-2 border-dashed border-muted/20">
                <span className="text-6xl grayscale opacity-30">{language.flag}</span>
                <div className="text-center">
                    <p className="font-bold uppercase tracking-widest text-xs">Waiting in Queue</p>
                    <p className="text-xs max-w-[200px] mt-2 leading-relaxed italic opacity-70">
                        The {language.name} version will generate after the current task completes.
                    </p>
                </div>
            </div>
        );
    }

    if (status === "generating") {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] bg-muted/5 rounded-xl border-2 border-dashed border-primary/20">
                <div className="relative mb-6">
                    <span className="text-6xl animate-pulse">{language.flag}</span>
                    <div className="absolute -bottom-2 -right-2 bg-background p-1.5 rounded-full border shadow-sm">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                </div>
                <div className="text-center space-y-3">
                    <p className="font-bold uppercase tracking-widest text-sm text-primary animate-pulse">Writing natively...</p>
                    <div className="flex flex-col gap-1">
                        <div className="h-1.5 w-40 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '40%' }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Drafting localized sections</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-destructive space-y-4 bg-destructive/5 rounded-xl border-2 border-dashed border-destructive/20">
                <AlertCircle className="w-12 h-12 opacity-50" />
                <div className="text-center">
                    <p className="font-bold uppercase tracking-widest text-sm">Generation Failed</p>
                    <p className="text-xs max-w-[300px] mt-2 leading-relaxed font-medium">
                        {error || `An error occurred while generating the ${language.name} version.`}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={containerStyles} dir={isRTL ? "rtl" : "ltr"}>
            <article
                className="prose prose-slate max-w-none dark:prose-invert"
                style={innerStyles}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
