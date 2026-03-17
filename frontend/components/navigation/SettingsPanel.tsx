"use client";

import { X, Settings, Image as ImageIcon, Sparkles, Moon, Sun, Database, Key } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ModelCard } from "@/components/onboarding/ModelCard";
import { modelIcons } from "@/lib/modelIcons";
import { useWordPressPublish } from "@/hooks/useWordPressPublish";
import { WordPressIcon } from "@/components/wordpress/WordPressIcon";
import { WordPressSiteCard } from "@/components/wordpress/WordPressSiteCard";
import { WordPressConnectModal } from "@/components/wordpress/WordPressConnectModal";
import { WPConnection } from "@/lib/wordpress/wpTypes";
import { Plus } from "lucide-react";

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
    const {
        apiConfig, setApiConfig,
        preferences, setPreferences,
        dataForSeoConfig, setDataForSeoConfig
    } = useAppContext();
    const router = useRouter();

    const [dfsLogin, setDfsLogin] = useState(dataForSeoConfig.login || "");
    const [dfsPassword, setDfsPassword] = useState(""); // Don't show existing password

    const {
        connections,
        addConnection,
        removeConnection,
        setDefaultConnection
    } = useWordPressPublish();

    const [isWPModalOpen, setIsWPModalOpen] = useState(false);
    const [editingConnection, setEditingConnection] = useState<WPConnection | null>(null);

    if (!isOpen) return null;

    const handleSwitchModel = () => {
        setApiConfig({ selectedModel: null, apiKey: null, savedAt: null });
        router.push("/onboarding");
        onClose();
    };

    const handleUpdateKey = () => {
        router.push("/onboarding");
        onClose();
    };

    const handleSaveDfs = () => {
        setDataForSeoConfig({
            login: dfsLogin,
            password: dfsPassword ? btoa(dfsPassword) : dataForSeoConfig.password,
            isActive: !!dfsLogin
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-200" onClick={onClose} />
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-[380px] bg-background border-l border-border z-50 p-6 overflow-y-auto animate-in slide-in-from-right duration-200 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                        <Settings size={20} className="text-muted-foreground" />
                        Settings
                    </h2>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-card transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* AI Model Section */}
                    <section>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">AI Model</h3>

                        {apiConfig.selectedModel ? (
                            <div className="mb-4">
                                <ModelCard
                                    id={apiConfig.selectedModel}
                                    name={apiConfig.selectedModel.charAt(0).toUpperCase() + apiConfig.selectedModel.slice(1)}
                                    description="Currently active model for generation."
                                    icon={modelIcons[apiConfig.selectedModel]}
                                    selected={true}
                                    onSelect={() => { }}
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground mb-4">No model selected.</p>
                        )}

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={handleSwitchModel}>
                                Switch Model
                            </Button>
                            <Button variant="default" className="flex-1 bg-card text-foreground border border-border hover:bg-border" onClick={handleUpdateKey}>
                                Update API Key
                            </Button>
                        </div>
                    </section>

                    <div className="h-px bg-border w-full" />

                    {/* Preferences Section */}
                    <section>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Preferences</h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {preferences.theme === "dark" ? <Moon size={18} className="text-muted-foreground" /> : <Sun size={18} className="text-muted-foreground" />}
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Dark Mode</p>
                                        <p className="text-xs text-muted-foreground">Toggle application theme</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={preferences.theme === "dark"}
                                    onCheckedChange={(c) => setPreferences({ ...preferences, theme: c ? "dark" : "light" })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">AI Images</p>
                                        <p className="text-xs text-muted-foreground">Generate inline blog imagery</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={preferences.includeAiImages}
                                    onCheckedChange={(c) => setPreferences({ ...preferences, includeAiImages: c })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ImageIcon size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Stock Photos</p>
                                        <p className="text-xs text-muted-foreground">Fetch relevant Unsplash/Pexels photos</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={preferences.includeStockImages}
                                    onCheckedChange={(c) => setPreferences({ ...preferences, includeStockImages: c })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Outline Preview</p>
                                        <p className="text-xs text-muted-foreground">Review H1 + H2 structure before full generation</p>
                                    </div>
                                </div>
                                <Switch
                                    id="settings-outline-preview"
                                    checked={preferences.showOutlinePreview ?? true}
                                    onCheckedChange={(c) => setPreferences({ ...preferences, showOutlinePreview: c })}
                                />
                            </div>
                        </div>
                    </section>


                    <div className="h-px bg-border w-full" />

                    {/* DataForSEO Section */}
                    <section>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider flex items-center justify-between">
                            DataForSEO (Beta)
                            {dataForSeoConfig.isActive && <div className="w-2 h-2 rounded-full bg-green-500" />}
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">API Login</label>
                                <div className="flex items-center px-3 bg-background border border-border rounded-lg group focus-within:border-accent transition-all">
                                    <Database size={14} className="text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={dfsLogin}
                                        onChange={(e) => setDfsLogin(e.target.value)}
                                        placeholder="DFS Login"
                                        className="bg-transparent border-none focus:ring-0 text-sm h-10 w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-muted-foreground">API Password</label>
                                <div className="flex items-center px-3 bg-background border border-border rounded-lg group focus-within:border-accent transition-all">
                                    <Key size={14} className="text-muted-foreground" />
                                    <input
                                        type="password"
                                        value={dfsPassword}
                                        onChange={(e) => setDfsPassword(e.target.value)}
                                        placeholder={dataForSeoConfig.password ? "••••••••" : "DFS Password"}
                                        className="bg-transparent border-none focus:ring-0 text-sm h-10 w-full"
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full bg-accent text-black font-bold h-10 hover:bg-accent/90"
                                onClick={handleSaveDfs}
                            >
                                Update Credentials
                            </Button>

                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                Enabling DataForSEO replaces AI volume estimates with actual monthly search data from Google & Bing.
                            </p>
                        </div>
                    </section>

                    <div className="h-px bg-border w-full" />

                    {/* WordPress Publishing Section */}
                    <section>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider flex items-center justify-between">
                            WordPress Publishing
                            <div className="flex gap-1">
                                {connections.length > 0 && <span className="w-2 h-2 rounded-full bg-green-500" />}
                            </div>
                        </h3>

                        {connections.length === 0 ? (
                            <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-[#2171b1]/10 flex items-center justify-center text-[#2171b1] mx-auto">
                                    <WordPressIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Publish Directly</h4>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        Connect your WordPress site to publish blogs as draft or live posts with one click. No plugin needed.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-border hover:bg-border/50 text-xs font-bold"
                                    onClick={() => {
                                        setEditingConnection(null);
                                        setIsWPModalOpen(true);
                                    }}
                                >
                                    Connect WordPress Site
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {connections.map((conn, idx) => (
                                    <WordPressSiteCard
                                        key={conn.id}
                                        connection={conn}
                                        isDefault={idx === 0}
                                        onEdit={() => {
                                            setEditingConnection(conn);
                                            setIsWPModalOpen(true);
                                        }}
                                        onRemove={() => removeConnection(conn.id)}
                                        onSetDefault={() => setDefaultConnection(conn.id)}
                                    />
                                ))}

                                {connections.length < 5 && (
                                    <Button
                                        variant="ghost"
                                        className="w-full h-10 border border-dashed border-border text-muted-foreground hover:text-foreground hover:bg-card text-[10px] font-bold uppercase tracking-wider gap-2"
                                        onClick={() => {
                                            setEditingConnection(null);
                                            setIsWPModalOpen(true);
                                        }}
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Another Site
                                    </Button>
                                )}
                            </div>
                        )}

                        <p className="mt-4 text-[10px] text-muted-foreground italic text-center">
                            Works with any WordPress site (5.6+) using Application Passwords.
                        </p>
                    </section>
                </div>
            </div>

            <WordPressConnectModal
                isOpen={isWPModalOpen}
                initialData={editingConnection}
                onClose={() => setIsWPModalOpen(false)}
                onSave={(conn) => {
                    if (editingConnection) {
                        // Update logic needed in hook? 
                        // For now remove and add is fine as per simple impl
                        removeConnection(editingConnection.id);
                    }
                    addConnection(conn);
                }}
            />
        </>
    );
}
