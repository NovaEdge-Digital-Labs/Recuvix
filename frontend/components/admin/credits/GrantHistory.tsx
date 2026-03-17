"use client";

import React, { useState, useEffect } from 'react';
import {
    History,
    Gift,
    Settings2,
    CheckCircle2,
    XCircle,
    Loader2,
    Calendar,
    ShieldAlert
} from 'lucide-react';
import { format } from 'date-fns';

export const GrantHistory = () => {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/credits/history?limit=50');
            const data = await response.json();
            if (data.success) {
                setHistory(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'applied': return 'bg-green-500/10 text-green-500 border border-green-500/20';
            case 'revoked': return 'bg-red-500/10 text-red-500 border border-red-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 border border-zinc-800">
                    <History className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Recent Grant Activity</h2>
                    <p className="text-zinc-500 text-xs">A log of all manual and automated credit distributions.</p>
                </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-4 text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        <span className="text-sm font-medium">Fetching history...</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-900/40 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-900">
                                <th className="py-3 pl-6">Event</th>
                                <th className="px-3 py-3 text-center">Amount</th>
                                <th className="px-3 py-3">Recipients</th>
                                <th className="px-3 py-3">Admin</th>
                                <th className="px-3 py-3 text-right pr-6">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/50">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-900/20 transition-colors">
                                    <td className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${item.rule_id ? 'bg-blue-500/10 text-blue-500' : 'bg-accent/10 text-accent'}`}>
                                                {item.rule_id ? <Settings2 className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white max-w-[200px] truncate">
                                                    {item.rule?.name || item.reason}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                                    {item.rule_id ? 'Auto Rule' : 'Manual Grant'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-center">
                                        <span className="text-sm font-black text-amber-500">+{item.credits_amount}</span>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-bold text-zinc-300">
                                                {item.profile?.full_name || 'Multiple Users'}
                                            </div>
                                            <div className="text-[10px] text-zinc-600 truncate max-w-[150px]">
                                                {item.profile?.email || 'Bulk Grant'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4">
                                        <div className="text-xs font-medium text-zinc-500 lowercase">{item.granted_by}</div>
                                    </td>
                                    <td className="px-3 py-4 text-right pr-6">
                                        <div className="flex flex-col items-end">
                                            <div className="text-xs text-white font-medium">{format(new Date(item.created_at), 'MMM dd, yyyy')}</div>
                                            <div className="text-[10px] text-zinc-500">{format(new Date(item.created_at), 'HH:mm')}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-zinc-600 italic">
                                        No grant activity found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
