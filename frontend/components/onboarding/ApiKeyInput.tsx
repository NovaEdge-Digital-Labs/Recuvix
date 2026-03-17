"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AIModel, useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export function ApiKeyInput({ modelId }: { modelId: AIModel }) {
    const [apiKey, setApiKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle");
    const { setApiConfig } = useAppContext();
    const router = useRouter();

    const placeholders: Record<AIModel, string> = {
        claude: "sk-ant-api03-...",
        openai: "sk-proj-...",
        gemini: "AIzaSy...",
        grok: "xai-...",
    };

    const testConnection = async () => {
        if (!apiKey.trim()) return;

        setTesting(true);
        setTestResult("idle");
        let success = false;

        try {
            if (modelId === "claude") {
                const res = await fetch("https://api.anthropic.com/v1/models", {
                    method: "GET",
                    headers: {
                        "x-api-key": apiKey,
                        "anthropic-version": "2023-06-01",
                        "anthropic-dangerous-direct-browser-access": "true",
                    },
                });
                success = res.ok;
            } else if (modelId === "openai") {
                const res = await fetch("https://api.openai.com/v1/models", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });
                success = res.ok;
            } else if (modelId === "gemini") {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                success = res.ok;
            } else if (modelId === "grok") {
                const res = await fetch("https://api.x.ai/v1/models", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                });
                success = res.ok;
            }
        } catch (e) {
            console.error("Connection test failed", e);
            success = false;
        }

        setTesting(false);
        setTestResult(success ? "success" : "error");
    };

    const saveAndContinue = () => {
        if (testResult !== "success") return;
        setApiConfig({
            selectedModel: modelId,
            apiKey: apiKey.trim(),
            savedAt: Date.now(),
        });
        router.push("/");
    };

    return (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <label className="block font-mono text-sm text-foreground mb-2">
                Paste your {modelId.charAt(0).toUpperCase() + modelId.slice(1)} API key
            </label>

            <div className="relative mb-3">
                <Input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        if (testResult !== "idle") setTestResult("idle");
                    }}
                    placeholder={placeholders[modelId]}
                    className="pr-10 bg-card h-12 text-md"
                />
                <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <Lock size={14} />
                <p>Your key is stored only in your browser. We never see it.</p>
            </div>

            {testResult === "success" && (
                <div className="flex items-center gap-2 text-sm text-[#44ff88] mb-4">
                    <CheckCircle2 size={16} />
                    <span>Connected successfully</span>
                </div>
            )}

            {testResult === "error" && (
                <div className="flex items-center gap-2 text-sm text-destructive mb-4">
                    <XCircle size={16} />
                    <span>Invalid key. Please check and try again.</span>
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={testConnection}
                    disabled={!apiKey.trim() || testing}
                    className="flex-1 h-12"
                >
                    {testing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                    Test Connection
                </Button>
                <Button
                    onClick={saveAndContinue}
                    disabled={testResult !== "success"}
                    className="flex-1 h-12 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                    Save & Continue
                </Button>
            </div>
        </div>
    );
}
