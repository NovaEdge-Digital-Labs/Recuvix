'use client';

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Trash2, Loader2, CheckCircle, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiKeysService } from '@/lib/db/apiKeysService';
import type { Database } from '@/lib/supabase/database';
import { toast } from 'sonner';

type Provider = Database['public']['Tables']['api_keys']['Row']['provider'];
type ApiKeyRow = Database['public']['Tables']['api_keys']['Row'];

const PROVIDERS: { value: Provider; label: string }[] = [
    { value: 'openai', label: 'OpenAI (ChatGPT)' },
    { value: 'claude', label: 'Anthropic (Claude)' },
    { value: 'gemini', label: 'Google Gemini' },
    { value: 'grok', label: 'xAI Grok' },
];

export function ApiKeysSection() {
    const { user } = useAuth();
    const [keys, setKeys] = useState<ApiKeyRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addingFor, setAddingFor] = useState<Provider | null>(null);
    const [newKey, setNewKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) return;
        setIsLoading(true); // Keep this to show loading state when user changes
        apiKeysService.getKeys(user.id)
            .then(setKeys)
            .catch(() => toast.error('Failed to load API keys')) // Re-added catch for error handling
            .finally(() => setIsLoading(false));
    }, [user]);

    const handleSave = async () => {
        if (!user || !addingFor || !newKey.trim()) return;
        setIsSaving(true);
        try {
            await apiKeysService.saveKey(user.id, addingFor, newKey.trim());
            const updatedKeys = await apiKeysService.getKeys(user.id);
            setKeys(updatedKeys);
            setAddingFor(null);
            setNewKey('');
            toast.success('API key saved');
        } catch {
            toast.error('Failed to save API key');
        }
        setIsSaving(false);
    };

    const handleDelete = async (provider: Provider) => {
        if (!user) return;
        try {
            await apiKeysService.deleteKey(user.id, provider);
            setKeys((prev) => prev.filter((k) => k.provider !== provider));
            toast.success('API key removed');
        } catch {
            toast.error('Failed to remove API key');
        }
    };

    const existingProviders = new Set(keys.map((k) => k.provider));

    return (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
            <div className="p-6">
                <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <Key size={18} className="text-muted-foreground" />
                    API Keys
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">Your BYOK AI provider keys. Stored securely, never shared.</p>
            </div>

            {isLoading ? (
                <div className="p-6 flex items-center justify-center">
                    <Loader2 size={18} className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="p-6 space-y-3">
                    {keys.map((key) => (
                        <div key={key.provider} className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-foreground">{PROVIDERS.find(p => p.value === key.provider)?.label || key.provider}</p>
                                <p className="text-xs text-muted-foreground">••••••••{key.key_hint}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-green-400" />
                                <button onClick={() => handleDelete(key.provider)} className="text-muted-foreground hover:text-red-400 transition-colors p-1">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Key */}
                    {addingFor ? (
                        <div className="p-4 bg-background border border-[#e8ff47]/30 rounded-xl space-y-3">
                            <p className="text-sm font-medium">{PROVIDERS.find(p => p.value === addingFor)?.label}</p>
                            <div className="relative">
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    placeholder="Paste your API key..."
                                    className="w-full h-10 px-3 pr-10 bg-card border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#e8ff47] transition-colors"
                                    autoFocus
                                />
                                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => { setAddingFor(null); setNewKey(''); }} className="flex-1 h-9 text-sm border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={isSaving || !newKey.trim()} className="flex-1 h-9 text-sm font-bold bg-[#e8ff47] text-black rounded-xl hover:bg-[#d4e840] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Save Key'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {PROVIDERS.filter(p => !existingProviders.has(p.value)).map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => setAddingFor(p.value)}
                                    className="flex items-center gap-1.5 h-8 px-3 text-xs text-muted-foreground border border-border rounded-lg hover:text-foreground hover:border-[#e8ff47]/50 transition-colors"
                                >
                                    <Plus size={12} /> {p.label}
                                </button>
                            ))}
                            {PROVIDERS.filter(p => !existingProviders.has(p.value)).length === 0 && (
                                <p className="text-xs text-muted-foreground">All providers configured ✓</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
