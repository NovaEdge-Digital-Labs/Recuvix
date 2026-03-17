"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Building2,
    Users,
    TrendingUp,
    CreditCard,
    ExternalLink,
    MapPin,
    ShieldCheck,
    Calendar,
    ArrowUpRight
} from 'lucide-react';

interface AgencyDetailModalProps {
    agency: any;
    isOpen: boolean;
    onClose: () => void;
}

export const AgencyDetailModal = ({ agency, isOpen, onClose }: AgencyDetailModalProps) => {
    if (!agency) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[700px] p-0 overflow-hidden rounded-3xl">
                {/* Header/Banner Area */}
                <div className="bg-gradient-to-br from-zinc-900 to-black p-8 border-b border-zinc-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Building2 size={120} />
                    </div>

                    <div className="relative z-10 flex items-start justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-black shadow-2xl shadow-accent/20">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">{agency.tenant_name}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                                        <ShieldCheck className="w-3 h-3 text-accent" />
                                        Verified Partner
                                    </div>
                                    {agency.is_active ? (
                                        <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest px-2 py-0.5 bg-green-500/10 rounded">Active</div>
                                    ) : (
                                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2 py-0.5 bg-red-500/10 rounded">Suspended</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
                            </div>
                            <div className="text-xl font-black text-white">{agency.user_count || 0}</div>
                        </div>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Gross Revenue</span>
                            </div>
                            <div className="text-xl font-black text-white">₹{(agency.monthly_revenue || 0).toLocaleString()}</div>
                        </div>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                <CreditCard className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">MRR</span>
                            </div>
                            <div className="text-xl font-black text-white">₹{(agency.mrr || 0).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Detailed Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Partner Identity</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Subdomain</span>
                                    <span className="text-white font-medium flex items-center gap-1">
                                        {agency.slug}.recuvix.in
                                        <ExternalLink className="w-3 h-3 text-zinc-700" />
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Primary Contact</span>
                                    <span className="text-white font-medium">{agency.contact_email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Joined Date</span>
                                    <span className="text-white font-medium">{new Date(agency.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Commercial Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Commission Rate</span>
                                    <span className="text-accent font-black">20%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Last Payout</span>
                                    <span className="text-white font-medium">₹{(agency.last_payout || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-500">Payout Status</span>
                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">Processed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex gap-3">
                        <button className="flex-1 h-12 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                            Update Partner Terms
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button className="px-6 h-12 rounded-xl border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-900 transition-colors">
                            Partner Dashboard
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
