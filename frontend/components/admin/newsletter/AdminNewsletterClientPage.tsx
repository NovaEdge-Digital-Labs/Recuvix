"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Users, PenTool, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NewsletterSubscriber, NewsletterSend } from '@/lib/db/newsletterService';
import SubscribersTab from '@/components/admin/newsletter/SubscribersTab';
import ComposeTab from '@/components/admin/newsletter/ComposeTab';
import HistoryTab from '@/components/admin/newsletter/HistoryTab';

interface AdminNewsletterClientPageProps {
    subscribers: NewsletterSubscriber[];
    history: NewsletterSend[];
}

export default function AdminNewsletterClientPage({ subscribers, history }: AdminNewsletterClientPageProps) {
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10">
            <div className="max-w-[1400px] mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white -ml-2 w-fit">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Newsletter Console</h1>
                                <p className="text-zinc-500 text-sm">Manage campaigns, subscribers, and track performance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Total Subscribers</p>
                        <p className="text-2xl font-bold">{subscribers.length}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Active</p>
                        <p className="text-2xl font-bold text-green-500">{subscribers.filter(s => s.status === 'active').length}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-1">
                        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Campaigns Sent</p>
                        <p className="text-2xl font-bold text-white">{history.length}</p>
                    </div>
                </div>

                {/* Tabs for different sections */}
                <Tabs defaultValue="subscribers" className="space-y-6">
                    <TabsList className="bg-zinc-900/50 border border-white/5 p-1 h-12 inline-flex">
                        <TabsTrigger value="subscribers" className="gap-2 h-10 px-6">
                            <Users className="w-4 h-4" />
                            Subscribers
                        </TabsTrigger>
                        <TabsTrigger value="compose" className="gap-2 h-10 px-6">
                            <PenTool className="w-4 h-4" />
                            Compose
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2 h-10 px-6">
                            <History className="w-4 h-4" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="subscribers" className="mt-0 focus-visible:outline-none">
                        <SubscribersTab subscribers={subscribers} />
                    </TabsContent>

                    <TabsContent value="compose" className="mt-0 focus-visible:outline-none">
                        <ComposeTab />
                    </TabsContent>

                    <TabsContent value="history" className="mt-0 focus-visible:outline-none">
                        <HistoryTab history={history} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
