"use client";

import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Activity,
    RefreshCw,
    Search,
    AlertCircle,
    Key
} from "lucide-react";
import { KeyCard } from "./KeyCard";
import { AddKeyModal } from "./AddKeyModal";
import { HealthCheckModal } from "./HealthCheckModal";

export function KeysTab() {
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchKeys = async () => {
        setIsLoading(true);
        const { data, error } = await (supabaseAdmin
            .from('platform_api_keys') as any)
            .select('*')
            .order('priority', { ascending: true });

        if (!error && data) {
            setKeys(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const filteredKeys = keys.filter(k =>
        k.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.provider.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search keys by label or provider..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border-zinc-800 rounded-lg pl-10 pr-4 h-11 text-sm focus:ring-accent focus:border-accent"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsHealthModalOpen(true)}
                        className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 gap-2"
                    >
                        <Activity className="w-4 h-4" />
                        Health Check
                    </Button>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-accent hover:bg-accent/90 text-black font-bold gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Key
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[200px] bg-zinc-900/50 rounded-xl border border-zinc-900 animate-pulse" />
                    ))}
                </div>
            ) : filteredKeys.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredKeys.map(key => (
                        <KeyCard key={key.id} keyData={key} onUpdate={fetchKeys} />
                    ))}
                </div>
            ) : (
                <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                        <Key className="w-6 h-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 font-medium">No API keys found</p>
                    <p className="text-zinc-600 text-sm mt-1">Start by adding your first platform API key.</p>
                </div>
            )}

            <AddKeyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchKeys}
            />

            <HealthCheckModal
                isOpen={isHealthModalOpen}
                onClose={() => setIsHealthModalOpen(false)}
                keys={keys}
                onComplete={fetchKeys}
            />
        </div>
    );
}
