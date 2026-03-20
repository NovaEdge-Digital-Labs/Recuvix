"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/AppContext";
import { AIModel } from "@/lib/types";
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
        openrouter: "sk-or-v1-...",
    };

    const testConnection = async () => {
        if (!apiKey.trim()) return;

        setTesting(true);
        setTestResult("idle");
        let success = false;

        try {
            const res = await fetch("/api/onboarding/validate-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ modelId, apiKey }),
            });
            const data = await res.json();
            success = data.success;
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
