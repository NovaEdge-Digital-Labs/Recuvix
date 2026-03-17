'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Loader2, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ReferralTreeModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
}

export const ReferralTreeModal = ({ user, isOpen, onClose }: ReferralTreeModalProps) => {
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && isOpen) {
            fetchTree();
        }
    }, [user, isOpen]);

    const fetchTree = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/referrals/tree/${user.id}`);
            const data = await response.json();
            if (data.success) {
                setReferrals(data.referrals);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                            <Users className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">Referral Tree</h2>
                            <div className="text-xs text-zinc-500 font-medium">Referrals by <span className="text-white">{user.full_name || user.email}</span></div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <div className="text-zinc-500 text-sm font-medium">Mapping referral tree...</div>
                        </div>
                    ) : referrals.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-white font-bold mb-1">No referrals yet</h3>
                            <p className="text-zinc-500 text-sm">This user hasn't successfully referred anyone yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {referrals.map((ref) => (
                                <div key={ref.id} className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-zinc-800 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-sm font-bold border border-zinc-800 text-zinc-400 group-hover:border-accent/30 transition-colors">
                                            {ref.user?.full_name?.[0] || ref.user?.email?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{ref.user?.full_name || 'Recuvix User'}</div>
                                            <div className="text-[11px] text-zinc-500">{ref.user?.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
                                                <FileText className="w-3 h-3 text-zinc-500" />
                                                {ref.user?.total_blogs_generated || 0} blogs
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                                                <Calendar className="w-3 h-3" />
                                                Joined {format(new Date(ref.user?.created_at), 'MMM dd')}
                                            </div>
                                        </div>
                                        <div className="w-24 text-right">
                                            {ref.status === 'rewarded' ? (
                                                <span className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Rewarded
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                                                    <Clock className="w-3 h-3" />
                                                    {ref.status.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 flex justify-end">
                    <Button onClick={onClose} variant="ghost" className="text-zinc-500 hover:text-white">Close View</Button>
                </div>
            </div>
        </div>
    );
};
