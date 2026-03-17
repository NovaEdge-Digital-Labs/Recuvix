'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Users,
    FileText,
    Layout,
    IndianRupee,
    ArrowUpRight,
    Activity,
    CreditCard,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';

interface Stats {
    totalRevenue: number;
    partnerShare: number;
    blogCount: number;
    userCount: number;
    workspaceCount: number;
}

interface Transaction {
    id: string;
    amount_total: number;
    transaction_type: string;
    status: string;
    created_at: string;
}

export function PartnerDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/wl/stats');
                const data = await res.json();
                if (data.stats) {
                    setStats(data.stats);
                    setTransactions(data.recentTransactions);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(val);
    };

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Partner Insights</h1>
                <p className="text-muted-foreground mt-1 text-lg">Detailed performance metrics for your platform instance.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    subtext="Gross volume"
                    icon={<IndianRupee className="h-5 w-5 text-emerald-500" />}
                    trend="+12% from last month"
                />
                <StatCard
                    title="Partner Share"
                    value={formatCurrency(stats?.partnerShare || 0)}
                    subtext="Your net earnings"
                    icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
                    trend="Updated in real-time"
                />
                <StatCard
                    title="Active Users"
                    value={stats?.userCount.toString() || '0'}
                    subtext="Total registrations"
                    icon={<Users className="h-5 w-5 text-purple-500" />}
                    trend="Growing community"
                />
                <StatCard
                    title="Blogs Generated"
                    value={stats?.blogCount.toString() || '0'}
                    subtext="AI efficiency"
                    icon={<FileText className="h-5 w-5 text-orange-500" />}
                    trend="Content engine active"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Usage Comparison / Distribution */}
                <Card className="lg:col-span-4 border-none shadow-xl bg-gradient-to-br from-card/50 to-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-accent" />
                            Platform Utilization
                        </CardTitle>
                        <CardDescription>Workspace and user distribution across your tenant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 font-medium">
                                    <Layout className="h-4 w-4 text-blue-400" />
                                    Active Workspaces
                                </span>
                                <span className="font-bold">{stats?.workspaceCount}</span>
                            </div>
                            <Progress value={Math.min((stats?.workspaceCount || 0) * 10, 100)} className="h-3 rounded-full bg-blue-100/10">
                                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000" />
                            </Progress>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 font-medium">
                                    <FileText className="h-4 w-4 text-orange-400" />
                                    Blog Output Intensity
                                </span>
                                <span className="font-bold">{stats?.blogCount}</span>
                            </div>
                            <Progress value={Math.min((stats?.blogCount || 0), 100)} className="h-3 rounded-full bg-orange-100/10" />
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-accent/10 text-accent">
                                <ArrowUpRight className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">Optimization Tip</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Your user to workspace ratio is healthy. Focus on increasing "Bulk Generation" usage to drive more credit sales.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card className="lg:col-span-3 border-none shadow-xl bg-gradient-to-br from-card/50 to-background/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-emerald-400" />
                            Recent Income
                        </CardTitle>
                        <CardDescription>Latest revenue transactions from your users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {(transactions || []).length > 0 ? (
                                transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-full bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold capitalize">{tx.transaction_type.replace('_', ' ')}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(tx.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right italic">
                                            <p className="text-sm font-black text-emerald-500">+{formatCurrency(tx.amount_total)}</p>
                                            <p className="text-[10px] text-muted-foreground">Paid via Razorpay</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-muted-foreground">
                                    <div className="mb-3 flex justify-center">
                                        <Activity className="h-8 w-8 opacity-20" />
                                    </div>
                                    <p className="text-sm">No transactions yet.</p>
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-accent hover:bg-accent/10">View Full History</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtext, icon, trend }: { title: string, value: string, subtext: string, icon: React.ReactNode, trend?: string }) {
    return (
        <Card className="border-none shadow-lg overflow-hidden relative group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card to-background">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black tracking-tight">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
                {trend && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-wider">
                        <Activity className="h-3 w-3" />
                        {trend}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-none shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-32 mb-1" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-[400px] rounded-xl" />
                <Skeleton className="lg:col-span-3 h-[400px] rounded-xl" />
            </div>
        </div>
    );
}
