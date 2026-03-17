"use client";

import { useGSCData } from "@/hooks/useGSCData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export function GscConnectCard() {
    const { connectGSC, isLoading } = useGSCData();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="w-full max-w-2xl bg-card border-border shadow-xl">
            <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.9 3.32-2.12 4.5s-2.84 2.1-5.72 2.1c-3.6 0-6.64-2.92-6.64-6.8s3.04-6.8 6.64-6.8c2.16 0 3.8 0.84 5 1.96l2.32-2.32c-1.84-1.72-4.24-2.92-7.32-2.92-5.48 0-10 4.52-10 10s4.52 10 10 10c3.12 0 5.48-1 7.32-2.92 1.92-1.92 2.52-4.6 2.52-6.88 0-.44-.04-.88-.12-1.32z" />
                    </svg>
                </div>
                <CardTitle className="text-2xl font-heading font-bold">Connect Google Search Console</CardTitle>
                <CardDescription className="text-lg mt-2">
                    See real keyword rankings, impressions, and clicks for every blog you publish.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-primary font-bold">1</div>
                        <p className="text-sm font-medium">Connect Account</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-primary font-bold">2</div>
                        <p className="text-sm font-medium">Verify Properties</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-primary font-bold">3</div>
                        <p className="text-sm font-medium">Track Rankings</p>
                    </div>
                </div>

                <Button
                    size="lg"
                    className="w-full h-14 text-lg font-heading tracking-wide shadow-lg shadow-primary/20"
                    onClick={connectGSC}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Connect My Search Console
                </Button>

                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border-t border-border pt-4">
                    <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-normal text-muted-foreground hover:bg-muted/50 transition-colors rounded-md">
                        <span>Why do we need access?</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4 space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Recuvix requests <strong>read-only</strong> access to your Search Console data. We use this to:
                        </p>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Automatically fetch impressions and clicks for your URLs.</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Identify exactly which keywords are driving traffic to your blogs.</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Provide AI-powered suggestions based on real performance data.</span>
                            </li>
                        </ul>
                        <p className="text-xs text-muted-foreground/60 italic pt-2">
                            Your data is stored only in your browser&apos;s localStorage and is never sent to our servers except for processing the current request.
                        </p>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
