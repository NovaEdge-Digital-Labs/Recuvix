"use client";

import { useState } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { encryptKey, maskKey } from "@/lib/managed/keyEncryption";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { ShieldCheck, Loader2 } from "lucide-react";

interface AddKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const PROVIDERS = [
    { value: 'claude', label: 'Anthropic Claude', defaultModel: 'claude-3-5-sonnet-20240620' },
    { value: 'openai', label: 'OpenAI GPT', defaultModel: 'gpt-4o' },
    { value: 'gemini', label: 'Google Gemini', defaultModel: 'gemini-1.5-pro' },
    { value: 'grok', label: 'xAI Grok', defaultModel: 'grok-1' },
];

export function AddKeyModal({ isOpen, onClose, onSuccess }: AddKeyModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        provider: 'claude',
        model: PROVIDERS[0].defaultModel,
        label: '',
        apiKey: '',
        priority: 10,
        dailyLimit: 0,
    });

    const handleProviderChange = (provider: string | null) => {
        if (!provider) return;
        const p = PROVIDERS.find(p => p.value === provider);
        setFormData(prev => ({
            ...prev,
            provider,
            model: p?.defaultModel || prev.model
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await (supabaseAdmin
                .from('platform_api_keys') as any)
                .insert({
                    provider: formData.provider,
                    model: formData.model,
                    label: formData.label,
                    encrypted_key: encryptKey(formData.apiKey),
                    key_hint: maskKey(formData.apiKey),
                    priority: formData.priority,
                    daily_request_limit: formData.dailyLimit,
                    is_active: true,
                    is_healthy: true,
                });

            if (error) throw error;

            onSuccess();
            onClose();
            setFormData({
                provider: 'claude',
                model: PROVIDERS[0].defaultModel,
                label: '',
                apiKey: '',
                priority: 10,
                dailyLimit: 0,
            });
        } catch (err) {
            console.error('Failed to save key:', err);
            alert('Failed to save key. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white max-w-lg">
                <DialogHeader>
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                        <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Add Platform API Key</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        This key will be stored encrypted and used for managed mode generations.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="provider" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Provider</Label>
                            <Select value={formData.provider} onValueChange={handleProviderChange}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 focus:ring-accent">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                                    {PROVIDERS.map(p => (
                                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Model ID</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                                className="bg-zinc-900 border-zinc-800 focus:ring-accent"
                                placeholder="e.g. gpt-4o"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="label" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Key Label (Internal)</Label>
                        <Input
                            id="label"
                            value={formData.label}
                            onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                            className="bg-zinc-900 border-zinc-800 focus:ring-accent"
                            placeholder="e.g. Claude Primary 1"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apiKey" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">API Key</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            value={formData.apiKey}
                            onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                            className="bg-zinc-900 border-zinc-800 focus:ring-accent"
                            placeholder="sk-..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Priority (Lower = First)</Label>
                            <Input
                                id="priority"
                                type="number"
                                value={formData.priority}
                                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                                className="bg-zinc-900 border-zinc-800 focus:ring-accent"
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dailyLimit" className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Daily Request Limit</Label>
                            <Input
                                id="dailyLimit"
                                type="number"
                                value={formData.dailyLimit}
                                onChange={(e) => setFormData(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) }))}
                                className="bg-zinc-900 border-zinc-800 focus:ring-accent"
                                min="0" // 0 = unlimited
                                placeholder="0 = Unlimited"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t border-zinc-900">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-500 hover:text-white">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-accent hover:bg-accent/90 text-black font-bold h-10 px-8" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Platform Key
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
