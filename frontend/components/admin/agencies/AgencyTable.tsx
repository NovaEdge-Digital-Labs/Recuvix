"use client";

import React, { useState, useEffect } from 'react';
import { AgencyRow } from './AgencyRow';
import { AgencyStatsRow } from './AgencyStatsRow';
import { AgencyDetailModal } from './AgencyDetailModal';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const AgencyTable = () => {
    const [loading, setLoading] = useState(true);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [search, setSearch] = useState('');
    const [selectedAgency, setSelectedAgency] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        fetchAgencies();
    }, []);

    const fetchAgencies = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/agencies');
            const data = await response.json();
            if (data.agencies) {
                setAgencies(data.agencies);
                setStats(data.stats);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAgencies = agencies.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.ownerEmail.toLowerCase().includes(search.toLowerCase()) ||
        a.subdomain.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {stats && <AgencyStatsRow stats={stats} />}

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            placeholder="Search agencies, domains, or owners..."
                            className="pl-10 bg-zinc-950 border-zinc-900 h-11 focus-visible:ring-accent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-3">Filter:</span>
                        <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg">
                            {['All', 'Active', 'Trial', 'Suspended'].map(f => (
                                <button
                                    key={f}
                                    className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <div className="text-zinc-500 text-sm font-medium">Loading Network Partners...</div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-900/40 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-900">
                                    <th className="py-3 pl-4 pr-3">Agency Entity</th>
                                    <th className="px-3 py-3">Owner Account</th>
                                    <th className="px-3 py-3">Licence Status</th>
                                    <th className="px-3 py-3">Total Members</th>
                                    <th className="px-3 py-3">Monthly Revenue</th>
                                    <th className="px-3 py-3 text-right pr-4">Management</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/50">
                                {filteredAgencies.map((agency) => (
                                    <AgencyRow
                                        key={agency.id}
                                        agency={agency}
                                        onViewDetails={(a) => {
                                            setSelectedAgency(a);
                                            setIsDetailOpen(true);
                                        }}
                                    />
                                ))}
                                {filteredAgencies.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-zinc-600 italic">
                                            No agencies found matching criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AgencyDetailModal
                agency={selectedAgency}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </div>
    );
};
