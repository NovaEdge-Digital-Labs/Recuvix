"use client";

import React from 'react';
import { Mail, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { NewsletterSend } from '@/lib/db/newsletterService';

interface HistoryTabProps {
    history: NewsletterSend[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ history }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-white/5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Open Rate</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold">0%</span>
                        <TrendingUp className="w-3 h-3 text-green-500" />
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-white/5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Sent</p>
                    <p className="text-2xl font-bold mt-1">{history.reduce((acc, curr) => acc + (curr.recipient_count || 0), 0)}</p>
                </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Recipients</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Performance</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.map((send) => (
                                <tr key={send.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-white">{send.subject}</span>
                                            <span className="text-xs text-zinc-500 truncate max-w-[200px]">{send.preview_text || 'No preview text'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-zinc-400">
                                            {send.sent_at ? new Date(send.sent_at).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-white font-medium">{send.recipient_count}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-500 uppercase">Opens</span>
                                                <span className="text-sm font-medium">{send.open_count}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-500 uppercase">Clicks</span>
                                                <span className="text-sm font-medium">{send.click_count}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {send.status === 'sent' ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-zinc-500" />
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${send.status === 'sent'
                                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                                    : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                                                }`}>
                                                {send.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {history.length === 0 && (
                        <div className="py-20 text-center text-zinc-500">
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p>No campaign history yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryTab;
