import React, { useState } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordPressIcon } from "./WordPressIcon";
import { WordPressHelpGuide } from "./WordPressHelpGuide";
import { WPConnection, WPCategory } from "@/lib/wordpress/wpTypes";

interface WordPressConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (connection: Omit<WPConnection, "id" | "connectedAt">) => void;
    initialData?: WPConnection | null;
}

export function WordPressConnectModal({
    isOpen,
    onClose,
    onSave,
    initialData
}: WordPressConnectModalProps) {
    const [label, setLabel] = useState(initialData?.label || "");
    const [siteUrl, setSiteUrl] = useState(initialData?.siteUrl || "");
    const [username, setUsername] = useState(initialData?.username || "");
    const [appPassword, setAppPassword] = useState(initialData?.appPassword || "");
    const [showPassword, setShowPassword] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState<"draft" | "publish">(initialData?.defaultStatus || "draft");

    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ siteTitle: string; wordpressVersion: string; siteDescription: string; authenticatedUser: { id: number; name: string }; categories: WPCategory[] } | null>(null);
    const [error, setError] = useState<{ message: string; hint: string } | null>(null);

    if (!isOpen) return null;

    async function handleTest() {
        setTesting(true);
        setError(null);
        setTestResult(null);

        // Auto-add https://
        let normalizedUrl = siteUrl.trim();
        if (normalizedUrl && !normalizedUrl.startsWith("http")) {
            normalizedUrl = `https://${normalizedUrl}`;
            setSiteUrl(normalizedUrl);
        }

        try {
            const res = await fetch("/api/wordpress/test-connection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ siteUrl: normalizedUrl, username, appPassword }),
            });

            const data = await res.json();
            if (data.success) {
                setTestResult(data);
            } else {
                setError({ message: data.error, hint: data.hint });
            }
        } catch {
            setError({
                message: "Failed to connect",
                hint: "Check your internet connection and site URL."
            });
        } finally {
            setTesting(false);
        }
    }

    function handleSave() {
        if (!testResult) return;
        onSave({
            label: label || testResult.siteTitle,
            siteUrl,
            username,
            appPassword,
            connected: true,
            lastTestedAt: new Date().toISOString(),
            wordpressVersion: testResult.wordpressVersion,
            siteTitle: testResult.siteTitle,
            siteDescription: testResult.siteDescription,
            defaultStatus,
            defaultCategory: testResult.categories?.[0]?.id || null, // Default to first found
            defaultAuthorId: testResult.authenticatedUser.id,
            categories: testResult.categories,
            authors: [{
                id: testResult.authenticatedUser.id,
                name: testResult.authenticatedUser.name,
                slug: testResult.authenticatedUser.name.toLowerCase().replace(/ /g, "-"),
                avatarUrl: ""
            }], // Will be refreshed later
        });
        onClose();
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#2171b1] flex items-center justify-center text-white">
                            <WordPressIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Connect WordPress Site</h2>
                            <p className="text-xs text-white/50">Stored locally in your browser</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/40 hover:text-white rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/70">Site Label <span className="text-white/30 text-[10px] ml-1">(Optional)</span></label>
                            <input
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                placeholder="My Blog, Client Site, etc."
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/70">WordPress URL</label>
                            <input
                                value={siteUrl}
                                onChange={e => setSiteUrl(e.target.value)}
                                placeholder="https://yoursite.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/70">Username</label>
                            <input
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="WP admin username"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 relative">
                            <label className="text-sm font-medium text-white/70">App Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={appPassword}
                                    onChange={e => setAppPassword(e.target.value)}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-all font-mono"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <WordPressHelpGuide siteUrl={siteUrl} />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70">Default Publish Status</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDefaultStatus("draft")}
                                className={`p-4 rounded-xl border text-left transition-all ${defaultStatus === "draft"
                                    ? "bg-accent/10 border-accent text-white"
                                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                    }`}
                            >
                                <div className="font-bold text-sm">Draft</div>
                                <div className="text-[10px] mt-1 opacity-70 italic whitespace-normal leading-tight">Review before it goes live</div>
                            </button>
                            <button
                                onClick={() => setDefaultStatus("publish")}
                                className={`p-4 rounded-xl border text-left transition-all ${defaultStatus === "publish"
                                    ? "bg-green-500/10 border-green-500/50 text-white"
                                    : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                                    }`}
                            >
                                <div className="font-bold text-sm">Publish</div>
                                <div className="text-[10px] mt-1 opacity-70 italic whitespace-normal leading-tight">Make it live immediately</div>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-white leading-none mb-1">Connection Failed</p>
                                <p className="text-xs text-red-400 leading-tight mb-2">{error.message}</p>
                                <p className="text-xs text-white/40 leading-tight italic">{error.hint}</p>
                            </div>
                        </div>
                    )}

                    {testResult && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-bold text-white leading-none mb-1">Connected to {testResult.siteTitle}</p>
                                    <p className="text-xs text-green-400">Logged in as {testResult.authenticatedUser.name}</p>
                                </div>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 text-right">
                                {testResult.categories?.length || 0} Categories<br />Detecting...
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/10 bg-white/[0.02] flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleTest}
                        disabled={testing || !siteUrl || !username || !appPassword}
                        className="h-12 border-white/10 bg-transparent text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest gap-2 flex-1"
                    >
                        {testing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            "Test Connection"
                        )}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!testResult || testing}
                        className="h-12 bg-accent hover:bg-accent-hover text-white transition-all text-xs font-bold uppercase tracking-widest flex-1 shadow-[0_4px_20px_rgba(255,51,102,0.3)] disabled:opacity-50 disabled:shadow-none"
                    >
                        Save Connection
                    </Button>
                </div>

                <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-start gap-3">
                    <div className="mt-0.5 text-accent">🔒</div>
                    <p className="text-[10px] leading-relaxed text-white/40">
                        <b>Privacy Notice:</b> Your WordPress credentials are stored <b>only in your browser&apos;s localStorage</b>.
                        They are sent to our server only when you publish, and are never stored or logged on our end.
                    </p>
                </div>
            </div>
        </div>
    );
}
