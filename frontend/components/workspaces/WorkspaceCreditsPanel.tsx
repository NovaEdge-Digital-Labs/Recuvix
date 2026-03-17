"use client";

import React, { useEffect, useState } from 'react';
import {
    Zap,
    History,
    BarChart3,
    ArrowUpRight,
    CreditCard,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useWorkspace } from '@/context/WorkspaceContext';
import { workspaceCreditsService } from '@/lib/db/workspaceCreditsService';
import { format } from 'date-fns';

export function WorkspaceCreditsPanel() {
    const { activeWorkspace } = useWorkspace();
    const [usage, setUsage] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!activeWorkspace) return;
            try {
                const [usageData, transData] = await Promise.all([
                    workspaceCreditsService.getMemberUsage(activeWorkspace.id),
                    workspaceCreditsService.getTransactions(activeWorkspace.id)
                ]);
                setUsage(usageData);
                setTransactions(transData);
            } catch (error) {
                console.error('Failed to fetch credit data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeWorkspace?.id]);

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-4xl font-bold">{activeWorkspace.credits_balance}</div>
                            <Zap className="size-8 text-primary opacity-20" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Shared team pool</p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Team Usage Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        {usage.length > 0 ? (
                            usage.slice(0, 3).map((u: any) => (
                                <div key={u.user_id} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>{u.invited_email}</span>
                                        <span className="font-medium">{u.credits_used || 0} credits</span>
                                    </div>
                                    <Progress value={Math.min(((u.credits_used || 0) / Math.max(activeWorkspace.credits_balance, 1)) * 100, 100)} className="h-1" />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground py-4 text-center">No usage data yet</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="size-5 text-muted-foreground" />
                        Transaction History
                    </CardTitle>
                    <CardDescription>Recent credit purchases and deductions.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((t: any) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="text-xs">
                                            {format(new Date(t.created_at), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {t.type === 'purchase' ? 'Credit Purchase' : 'Blog Generation'}
                                        </TableCell>
                                        <TableCell className={t.amount > 0 ? 'text-green-600 font-medium' : 'text-foreground'}>
                                            {t.amount > 0 ? `+${t.amount}` : t.amount}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Complete</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 border rounded-lg bg-muted/20">
                            <CreditCard className="size-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">No transactions found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
