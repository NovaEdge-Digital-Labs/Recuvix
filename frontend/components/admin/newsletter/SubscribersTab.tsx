"use client";

import React, { useState, useMemo } from 'react';
import { Mail, Download, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsletterSubscriber } from '@/lib/db/newsletterService';

interface SubscribersTabProps {
    subscribers: NewsletterSubscriber[];
}

const SubscribersTab: React.FC<SubscribersTabProps> = ({ subscribers }) => {
    const [search, setSearch] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredSubscribers = useMemo(() => {
        return subscribers.filter(s => {
            const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase()) ||
                (s.name?.toLowerCase().includes(search.toLowerCase()));
            const matchesSource = sourceFilter === 'all' || s.source === sourceFilter;
            const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchesSearch && matchesSource && matchesStatus;
        });
    }, [subscribers, search, sourceFilter, statusFilter]);

    const handleExportCSV = () => {
        const headers = ['Email', 'Name', 'Source', 'Status', 'Date subscribed'];
        const csvContent = [
            headers.join(','),
            ...filteredSubscribers.map(s => [
                s.email,
                `"${s.name || ''}"`,
                s.source,
                s.status,
                new Date(s.subscribed_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'newsletter_subscribers.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-zinc-950 border-zinc-800"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400 outline-none"
                    >
                        <option value="all">All Sources</option>
                        <option value="website">Website</option>
                        <option value="blog">Blog</option>
                        <option value="changelog">Changelog</option>
                        <option value="landing">Landing</option>
                        <option value="footer">Footer</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400 outline-none"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                    </select>
                    <Button onClick={handleExportCSV} variant="outline" className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900 gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subscriber</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSubscribers.map((s) => (
                                <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{s.email}</span>
                                            {s.name && <span className="text-xs text-zinc-500">{s.name}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-zinc-400 capitalize">{s.source}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-zinc-400">
                                            {new Date(s.subscribed_at).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${s.status === 'active'
                                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                                : s.status === 'unsubscribed'
                                                    ? 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                            }`}>
                                            {s.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSubscribers.length === 0 && (
                        <div className="py-20 text-center text-zinc-500">
                            <Mail className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p>No subscribers match your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscribersTab;
