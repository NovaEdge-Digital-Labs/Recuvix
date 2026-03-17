"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGSCData } from "@/hooks/useGSCData";
import { exchangeCode } from "@/lib/tracker/gscClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { saveConfig } = useGSCData();

    const [status, setStatus] = useState<"loading" | "selecting" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);
    const [sites, setSites] = useState<{ siteUrl: string; permissionLevel: string }[]>([]);
    const [tempTokens, setTempTokens] = useState<{ accessToken: string; refreshToken: string; expiresIn: number } | null>(null);

    const finalizeConnection = useCallback((siteUrl: string, tokens: { accessToken: string; refreshToken: string; expiresIn: number }) => {
        const config = {
            connected: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            tokenExpiry: Date.now() + tokens.expiresIn * 1000,
            siteUrl,
            connectedAt: new Date().toISOString(),
        };

        saveConfig(config);
        setStatus("success");

        // Redirect after 2 seconds
        setTimeout(() => {
            router.push("/tracker");
        }, 2000);
    }, [saveConfig, router]);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) {
            setStatus("error");
            setError("No authorization code received from Google.");
            return;
        }

        const handleExchange = async () => {
            try {
                const redirectUri = `${window.location.origin}/tracker/callback`;
                const tokens = await exchangeCode(code, redirectUri);
                setTempTokens(tokens);

                // Fetch sites to let user select
                const sitesList = await (async () => {
                    const resp = await fetch("/api/tracker/gsc/sites", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accessToken: tokens.accessToken }),
                    });
                    const data = await resp.json();
                    return (data.sites || []) as { siteUrl: string; permissionLevel: string }[];
                })();

                if (sitesList.length === 0) {
                    throw new Error("No verified sites found in your Google Search Console account.");
                }

                if (sitesList.length === 1) {
                    // Auto-select if only one site
                    finalizeConnection(sitesList[0].siteUrl, tokens);
                } else {
                    setSites(sitesList);
                    setStatus("selecting");
                }
            } catch (err: unknown) {
                setStatus("error");
                setError((err as Error).message || "Failed to connect to Google Search Console");
            }
        };

        handleExchange();
    }, [searchParams, finalizeConnection]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-border shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-heading">
                        {status === "loading" && "Connecting to Google..."}
                        {status === "selecting" && "Select a Site"}
                        {status === "success" && "Connected successfully!"}
                        {status === "error" && "Connection Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {status === "loading" && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground">Exchanging tokens and verifying your sites...</p>
                        </div>
                    )}

                    {status === "selecting" && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground text-sm text-center">
                                We found multiple sites in your account. Choose the one you want to track:
                            </p>
                            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {sites.map((site) => (
                                    <Button
                                        key={site.siteUrl}
                                        variant="outline"
                                        className="w-full justify-start text-left h-auto py-3 px-4"
                                        onClick={() => {
                                            if (tempTokens) {
                                                finalizeConnection(site.siteUrl, tempTokens);
                                            }
                                        }}
                                    >
                                        <div className="truncate">
                                            <div className="font-medium truncate">{site.siteUrl}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{site.permissionLevel}</div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                            <p className="text-muted-foreground">Successfully connected! Redirecting you to the dashboard...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                            <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                            <p className="text-foreground font-medium mb-2">Error</p>
                            <p className="text-muted-foreground mb-6">{error}</p>
                            <Button onClick={() => router.push("/tracker")} className="w-full">
                                Go Back to Tracker
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function TrackerCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <CallbackHandler />
        </Suspense>
    );
}
