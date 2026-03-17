"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Save,
    RefreshCw,
    Settings,
    ShieldCheck,
    Coins,
    Users
} from "lucide-react";

export function SettingsTab() {
    const [settings, setSettings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.success && data.settings) setSettings(data.settings);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdateSetting = (key: string, value: any) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });
            alert('Settings saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="h-64 bg-zinc-900/20 rounded-2xl animate-pulse" />;

    const getSettingValue = (key: string) => settings.find(s => s.key === key)?.value;

    return (
        <div className="max-w-4xl space-y-6">
            <Card className="bg-zinc-950 border-zinc-900">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Platform Configuration</CardTitle>
                            <CardDescription className="text-zinc-500">Global settings for credit system and managed mode.</CardDescription>
                        </div>
                        <Button onClick={handleSave} disabled={isSaving} className="bg-accent hover:bg-accent/90 text-black font-bold h-10 px-6 gap-2">
                            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save All Changes
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                    {/* Managed Mode Toggle */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-900">
                        <div className="space-y-1">
                            <Label className="text-sm font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-accent" />
                                Global Managed Mode
                            </Label>
                            <p className="text-xs text-zinc-500">Enable or disable managed generation for all users instantly.</p>
                        </div>
                        <Switch
                            checked={getSettingValue('managed_mode_enabled') === true}
                            onCheckedChange={(val) => handleUpdateSetting('managed_mode_enabled', val)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <Coins className="w-4 h-4" /> Credits & Quotas
                            </h3>

                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Max blogs per user per day</Label>
                                <Input
                                    type="number"
                                    value={getSettingValue('max_blogs_per_user_per_day') || 0}
                                    onChange={(e) => handleUpdateSetting('max_blogs_per_user_per_day', parseInt(e.target.value))}
                                    className="bg-zinc-900 border-zinc-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Free credits on signup</Label>
                                <Input
                                    type="number"
                                    value={getSettingValue('free_credits_on_signup') || 0}
                                    onChange={(e) => handleUpdateSetting('free_credits_on_signup', parseInt(e.target.value))}
                                    className="bg-zinc-900 border-zinc-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" /> Error Handling
                            </h3>

                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Auto-disable key after failures</Label>
                                <Input
                                    type="number"
                                    value={getSettingValue('auto_disable_after_failures') || 5}
                                    onChange={(e) => handleUpdateSetting('auto_disable_after_failures', parseInt(e.target.value))}
                                    className="bg-zinc-900 border-zinc-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-500">Rate limit backoff (minutes)</Label>
                                <Input
                                    type="number"
                                    value={getSettingValue('rate_limit_backoff_minutes') || 60}
                                    onChange={(e) => handleUpdateSetting('rate_limit_backoff_minutes', parseInt(e.target.value))}
                                    className="bg-zinc-900 border-zinc-800"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
