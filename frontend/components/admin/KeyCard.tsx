"use client";

import { useState } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Zap,
    Trash2,
    Edit2,
    ShieldOff,
    Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface KeyCardProps {
    keyData: any;
    onUpdate: () => void;
}

export function KeyCard({ keyData, onUpdate }: KeyCardProps) {
    const [isTesting, setIsTesting] = useState(false);

    const status = !keyData.is_active ? 'disabled' :
        !keyData.is_healthy ? 'unhealthy' :
            keyData.rate_limit_reset_at && new Date(keyData.rate_limit_reset_at) > new Date() ? 'rate_limited' :
                'active';

    const getStatusColor = () => {
        switch (status) {
            case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rate_limited': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'unhealthy': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'disabled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const handleToggleActive = async () => {
        await (supabaseAdmin
            .from('platform_api_keys') as any)
            .update({ is_active: !keyData.is_active })
            .eq('id', keyData.id);
        onUpdate();
    };

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${keyData.label}"?`)) {
            await (supabaseAdmin
                .from('platform_api_keys') as any)
                .delete()
                .eq('id', keyData.id);
            onUpdate();
        }
    };

    const handleHealthCheck = async () => {
        setIsTesting(true);
        // Simple test: just wait for a second to simulate an API call
        // In reality, this would call a test function for the provider
        await new Promise(r => setTimeout(r, 1000));

        // Update healthy status randomly for demo purposes
        await (supabaseAdmin
            .from('platform_api_keys') as any)
            .update({ is_healthy: true, last_success_at: new Date().toISOString() })
            .eq('id', keyData.id);

        setIsTesting(false);
        onUpdate();
    };

    return (
        <Card className="bg-zinc-950 border-zinc-900 hover:border-zinc-800 transition-all overflow-hidden relative group">
            <CardContent className="p-5 pb-4 space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-zinc-400">
                            {keyData.provider.slice(0, 2)}
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm tracking-tight">{keyData.label}</h3>
                            <p className="text-[11px] text-zinc-500 font-mono">{keyData.key_hint}</p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger {...({ asChild: true } as any)}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-800 text-zinc-400">
                            <DropdownMenuItem onClick={() => { }} className="hover:bg-zinc-900 hover:text-white gap-2 py-2">
                                <Edit2 className="w-3.5 h-3.5" /> Edit Key
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleHealthCheck} className="hover:bg-zinc-900 hover:text-white gap-2 py-2">
                                <Activity className="w-3.5 h-3.5" /> Test Health
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleToggleActive} className="hover:bg-zinc-900 hover:text-white gap-2 py-2">
                                {keyData.is_active ? <ShieldOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                {keyData.is_active ? 'Disable Key' : 'Enable Key'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-900" />
                            <DropdownMenuItem onClick={handleDelete} className="hover:bg-red-500/10 hover:text-red-500 gap-2 py-2 text-red-600">
                                <Trash2 className="w-3.5 h-3.5" /> Delete Key
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div>
                    <Badge variant="outline" className={`${getStatusColor()} font-medium text-[10px] uppercase tracking-wider h-5 flex-shrink-0`}>
                        {status.replace('_', ' ')}
                    </Badge>
                    {status === 'rate_limited' && (
                        <p className="text-[10px] text-yellow-500/70 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Resets in {formatDistanceToNow(new Date(keyData.rate_limit_reset_at!))}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-900">
                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Today's Req</p>
                        <p className="text-sm font-mono text-zinc-300">{keyData.requests_today} / {keyData.daily_request_limit || '∞'}</p>
                    </div>
                    <div className="p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-900">
                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Failures</p>
                        <p className="text-sm font-mono text-zinc-300">{keyData.consecutive_failures}</p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 py-3 bg-zinc-900/30 border-t border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    Last used: {keyData.last_used_at ? formatDistanceToNow(new Date(keyData.last_used_at)) + " ago" : 'Never'}
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${keyData.is_healthy ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className="text-[10px] text-zinc-400 font-medium">P{keyData.priority}</span>
                </div>
            </CardFooter>

            {isTesting && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px] z-10">
                    <div className="flex flex-col items-center gap-2">
                        <Zap className="w-5 h-5 text-accent animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Testing...</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
