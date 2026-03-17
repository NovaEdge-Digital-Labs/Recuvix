'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Globe,
    ExternalLink,
    ShieldCheck,
    ShieldAlert,
    MoreVertical,
    Settings,
    Eye,
    Trash2,
    Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { CreateTenantModal } from './CreateTenantModal';

export function WhiteLabelTab() {
    const supabase = createClient();
    const [tenants, setTenants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('wl_tenants')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error('Failed to fetch tenants');
        } else {
            setTenants(data || []);
        }
        setIsLoading(false);
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.custom_domain?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tenants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
                    />
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-4 h-4" />
                    Create Tenant
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
                    ))
                ) : filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                        <TenantCard key={tenant.id} tenant={tenant} onUpdate={fetchTenants} />
                    ))
                ) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl">
                        <Globe className="w-12 h-12 text-zinc-700 mb-4" />
                        <p className="text-zinc-500 text-sm">No tenants found matching your search.</p>
                    </div>
                )}
            </div>

            <CreateTenantModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchTenants}
            />
        </div>
    );
}

function TenantCard({ tenant, onUpdate }: { tenant: any, onUpdate: () => void }) {
    const isSuspended = tenant.status === 'suspended';

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-accent/30 transition-all duration-300">
            {/* Header / Branding */}
            <div className="h-20 bg-zinc-950 p-4 flex items-center justify-between border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    {tenant.logo_url ? (
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 p-1">
                            <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-accent" />
                        </div>
                    )}
                    <div>
                        <h3 className="font-bold text-sm text-zinc-100">{tenant.name}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{tenant.slug}</p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800 text-zinc-300">
                        <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-black cursor-pointer">
                            <Settings className="w-4 h-4" />
                            Manage Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 focus:bg-accent focus:text-black cursor-pointer">
                            <Eye className="w-4 h-4" />
                            View Site
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="gap-2 text-red-500 focus:bg-red-500 focus:text-white cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                            Delete Tenant
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Info */}
            <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Domains</p>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                            <span>{tenant.slug}.recuvix.in</span>
                            <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">Active</span>
                        </div>
                        {tenant.custom_domain && (
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>{tenant.custom_domain}</span>
                                {tenant.domain_verified ? (
                                    <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded border border-green-500/20">Verified</span>
                                ) : (
                                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">Pending</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isSuspended ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <span className="text-[11px] font-medium text-zinc-500 capitalize">{tenant.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                            <Globe className="w-3 h-3" />
                            WL Enabled
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4">
                <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition-colors border border-zinc-700 group-hover:border-accent/20">
                    Manage Branding & Domain
                </button>
            </div>
        </div>
    );
}
