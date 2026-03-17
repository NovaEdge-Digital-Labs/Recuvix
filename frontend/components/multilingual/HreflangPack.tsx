import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface HreflangPackProps {
    htmlContent: string;
}

export function HreflangPack({ htmlContent }: HreflangPackProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(htmlContent);
        setCopied(true);
        toast.success("Hreflang pack copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4 pt-6 mt-6 border-t">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-widest leading-none">Hreflang Pack</h3>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 max-w-[400px]">
                        Add these tags to the <code className="bg-muted px-1 rounded">&lt;head&gt;</code> of every language version to tell Google about your localized content.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-bold gap-2"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Pack"}
                </Button>
            </div>

            <div className="relative group">
                <pre className="p-4 bg-muted/50 rounded-xl border font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[150px] scrollbar-hide">
                    {htmlContent}
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-muted/50 via-transparent to-transparent pointer-events-none group-hover:opacity-0 transition-opacity" />
            </div>
        </div>
    );
}
