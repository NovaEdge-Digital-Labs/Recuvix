"use client";

import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import {
    Coins,
    History,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { downloadInvoice } from "@/lib/credits/invoiceGenerator";
import { useAuth } from "@/context/AuthContext";

export function CreditsSection() {
    const { user } = useAuth();
    const { balance, transactions, isLoading, stats } = useCredits();

    if (isLoading) {
        return (
            <section className="bg-card border border-border rounded-xl p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-24 rounded-lg" />
                    <Skeleton className="h-24 rounded-lg" />
                    <Skeleton className="h-24 rounded-lg" />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <Coins className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Credits & Usage</h2>
                        <p className="text-xs text-zinc-400">Manage your blog generation credits</p>
                    </div>
                </div>
                <Link href="/pricing" className="hidden sm:block">
                    <Button variant="outline" size="sm" className="gap-2 border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                        Buy Credits <ExternalLink size={14} />
                    </Button>
                </Link>
            </div>

            <div className="p-6 bg-zinc-950/30 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-zinc-800">
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 shadow-inner">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Current Balance</p>
                    <p className="text-3xl font-bold text-white mt-1">{balance ?? 0}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">1 Credit = 1 Managed Blog</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 shadow-inner">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Purchased</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.total_purchased ?? 0}</p>
                    <p className="text-[10px] text-accent mt-1">+ All time purchases</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 shadow-inner">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Used</p>
                    <p className="text-3xl font-bold text-white mt-1">{stats?.total_used ?? 0}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Managed blogs generated</p>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <History size={16} className="text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-700">Recent Transactions</h3>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                        <p className="text-sm text-zinc-500">No transactions yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx: any) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-full",
                                        tx.type === 'purchase' || tx.type === 'refund' || tx.type === 'bonus'
                                            ? "bg-accent/10 text-accent"
                                            : "bg-zinc-800 text-zinc-400"
                                    )}>
                                        {tx.type === 'purchase' || tx.type === 'refund' || tx.type === 'bonus'
                                            ? <ArrowUpRight size={14} />
                                            : <ArrowDownRight size={14} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white capitalize">{tx.type} {tx.metadata?.pack_id ? `- ${tx.metadata.pack_id}` : ''}</p>
                                        <p className="text-[10px] text-zinc-500">{format(new Date(tx.created_at), 'PPP p')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "text-sm font-bold",
                                        tx.amount > 0 ? "text-accent" : "text-white"
                                    )}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </span>
                                    {tx.type === 'purchase' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400"
                                            title="Download Invoice"
                                            onClick={() => downloadInvoice({
                                                invoiceNumber: tx.metadata?.razorpay_order_id || tx.id.slice(0, 8),
                                                date: format(new Date(tx.created_at), 'PPP'),
                                                customerName: user?.email?.split('@')[0] || 'User',
                                                customerEmail: user?.email || '',
                                                packName: tx.metadata?.pack_id || 'Credit Pack',
                                                credits: Math.abs(tx.amount),
                                                amount: tx.metadata?.amount_paid_inr || 0,
                                                currency: 'INR',
                                                transactionId: tx.id
                                            })}
                                        >
                                            <Download size={14} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
