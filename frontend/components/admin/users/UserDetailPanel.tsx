import React, { useState, useEffect } from 'react';
import {
    X,
    CreditCard,
    FileText,
    History,
    Gift,
    AlertCircle,
    ShieldAlert,
    ShieldCheck,
    Loader2,
    ExternalLink,
    Sparkles
} from 'lucide-react';
import { LabelBadge } from './LabelBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface UserDetailPanelProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: any) => void;
}

export const UserDetailPanel = ({ user, isOpen, onClose, onUpdate }: UserDetailPanelProps) => {
    const [adminNote, setAdminNote] = useState(user?.admin_note || '');
    const [savingNote, setSavingNote] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [creditHistory, setCreditHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchData = async () => {
        setLoadingStats(true);
        setLoadingHistory(true);
        try {
            const response = await fetch(`/api/admin/users/${user.id}/stats`);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
                setCreditHistory(data.creditHistory);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStats(false);
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (user && isOpen) {
            setAdminNote(user.admin_note || '');
            fetchData();
        }
    }, [user, isOpen]);

    const handleSaveNote = async () => {
        if (adminNote === user?.admin_note) return;
        setSavingNote(true);
        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminNote })
            });
            const data = await response.json();
            if (data.success) {
                onUpdate(data.user);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavingNote(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[480px] bg-zinc-950 border-l border-zinc-900 z-[100] shadow-2xl transition-transform flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-xl font-bold border border-zinc-800">
                        {user.full_name?.[0] || user.email?.[0]}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-tight">{user.full_name || 'No Name'}</h2>
                        <div className="text-sm text-zinc-500">{user.email}</div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Status Badges */}
                <div className="flex items-center gap-3">
                    <LabelBadge label={user.user_label || 'none'} />
                    {user.is_suspended ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold uppercase tracking-wider">
                            <ShieldAlert className="w-3 h-3" />
                            Suspended
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3 h-3" />
                            Active
                        </span>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                        <div className="text-zinc-500 text-xs font-medium uppercase mb-1 flex items-center gap-2">
                            <CreditCard className="w-3 h-3" />
                            Credits Balance
                        </div>
                        <div className="text-xl font-bold text-white">{user.credits_balance}</div>
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                        <div className="text-zinc-500 text-xs font-medium uppercase mb-1 flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-accent" />
                            Referrals
                        </div>
                        <div className="text-xl font-bold text-white">{user.total_referrals || 0}</div>
                        <div className="text-[10px] text-zinc-500">{user.total_referral_credits_earned || 0} credits earned</div>
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                        <div className="text-zinc-500 text-xs font-medium uppercase mb-1 flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            Total Blogs
                        </div>
                        <div className="text-xl font-bold text-white">{stats?.totalBlogs || user.total_blogs_generated || 0}</div>
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                        <div className="text-zinc-500 text-xs font-medium uppercase mb-1">Purchased</div>
                        <div className="text-xl font-bold text-emerald-500">₹{(stats?.totalCreditsPurchased || 0).toLocaleString()}</div>
                    </div>
                    <div className="p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl">
                        <div className="text-zinc-500 text-xs font-medium uppercase mb-1">Free Received</div>
                        <div className="text-xl font-bold text-amber-500">{user.total_free_credits_received || 0}</div>
                    </div>
                </div>

                {/* Admin Note */}
                <div className="space-y-3">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                        Internal Admin Note
                        {savingNote && <Loader2 className="w-3 h-3 animate-spin" />}
                    </div>
                    <Textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        onBlur={handleSaveNote}
                        placeholder="Add internal notes about this user..."
                        className="bg-zinc-950 border-zinc-900 min-h-[100px] text-sm focus:ring-accent"
                    />
                </div>

                {/* Recent Activity / Credit History */}
                <div className="space-y-4">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <History className="w-3 h-3" />
                        Recent Transactions
                    </div>
                    <div className="space-y-2">
                        {loadingHistory ? (
                            <div className="text-center py-4 text-zinc-600 text-sm italic">Loading history...</div>
                        ) : creditHistory.length === 0 ? (
                            <div className="text-center py-4 text-zinc-600 text-sm italic">No recent transactions</div>
                        ) : creditHistory.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl">
                                <div>
                                    <div className="text-sm font-bold text-white capitalize">{tx.type.replace('_', ' ')}</div>
                                    <div className="text-[10px] text-zinc-500">{new Date(tx.created_at).toLocaleString()}</div>
                                </div>
                                <div className={`text-sm font-bold ${tx.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Grant Inline */}
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl space-y-4">
                    <div className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                        <Gift className="w-3 h-3" />
                        Quick Grant Credits
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Amt"
                            className="w-20 bg-zinc-950 border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                        />
                        <input
                            type="text"
                            placeholder="Reason (e.g. VIP Bonus)"
                            className="flex-1 bg-zinc-950 border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                        />
                        <Button className="bg-accent text-black font-bold h-9 px-4">Give</Button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-zinc-900">
                    <Button
                        variant="destructive"
                        className="w-full bg-red-950/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white font-bold"
                    >
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        {user.is_suspended ? 'Unsuspend Account' : 'Suspend Account'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
