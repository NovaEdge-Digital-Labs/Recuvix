"use client";

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Settings2,
    Users,
    History,
    Sparkles,
    Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreateRuleModal } from './CreateRuleModal';
import { CreditRuleCard } from './CreditRuleCard';
import { GrantSegment } from './GrantSegment';
import { GrantHistory } from './GrantHistory';
import { toast } from 'sonner';

export const FreeCreditsTab = () => {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const fetchRules = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/credit-rules');
            const data = await response.json();
            if (data.success && data.rules) {
                setRules(data.rules);
            }
        } catch (err) {
            console.error('Failed to fetch rules', err);
            toast.error('Failed to fetch credit rules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleDeleteRule = async (id: string) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;

        try {
            const response = await fetch(`/api/admin/credit-rules?id=${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Rule deleted successfully');
                fetchRules();
            } else {
                toast.error(data.error || 'Failed to delete rule');
            }
        } catch (err) {
            console.error(err);
            toast.error('Internal server error');
        }
    };

    const handleTriggerRule = (id: string) => {
        toast.info('Rule tester not yet implemented natively.');
    };

    if (showHistory) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            Grant History
                            <History className="w-5 h-5 text-accent" />
                        </h1>
                        <p className="text-zinc-500 text-sm">Review logs of manual and automated distributions.</p>
                    </div>
                    <Button
                        onClick={() => setShowHistory(false)}
                        className="bg-zinc-900 border border-zinc-800 text-white font-bold h-10 px-6 hover:bg-zinc-800"
                    >
                        Back to Engine
                    </Button>
                </div>
                <GrantHistory />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Free Credits Engine
                        <Sparkles className="w-5 h-5 text-accent" />
                    </h1>
                    <p className="text-zinc-500 text-sm">Automate user growth with rules and manage administrative grants.</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setShowHistory(true)}
                        className="bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white h-10 px-4"
                    >
                        <History className="w-4 h-4 mr-2" />
                        Grant History
                    </Button>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-accent hover:bg-accent/90 text-black font-bold h-10 px-6"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Rule
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="rules" className="space-y-6">
                <TabsList className="bg-zinc-900/50 border border-zinc-900 p-1 rounded-xl h-11">
                    <TabsTrigger value="rules" className="gap-2 px-4 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-black text-xs font-bold uppercase tracking-widest">
                        <Settings2 className="w-4 h-4" />
                        Auto Rules
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="gap-2 px-4 rounded-lg data-[state=active]:bg-accent data-[state=active]:text-black text-xs font-bold uppercase tracking-widest">
                        <Users className="w-4 h-4" />
                        Manual Grants
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="rules" className="space-y-6 outline-none">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        </div>
                    ) : rules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {rules.map((rule) => (
                                <CreditRuleCard
                                    key={rule.id}
                                    rule={rule}
                                    onEdit={(r) => console.log('Edit', r)}
                                    onDelete={handleDeleteRule}
                                    onTrigger={handleTriggerRule}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            <div className="col-span-full py-20 bg-zinc-950 border border-zinc-900 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                    <Settings2 className="w-8 h-8" />
                                </div>
                                <div className="text-center space-y-1">
                                    <div className="text-white font-bold">No active rules</div>
                                    <div className="text-zinc-500 text-sm">Create your first automated credit rule to reward users.</div>
                                </div>
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="bg-zinc-900 border border-zinc-800 text-white font-bold h-9 px-6 hover:bg-zinc-800"
                                >
                                    Create First Rule
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="manual" className="space-y-6 outline-none">
                    <GrantSegment />
                </TabsContent>
            </Tabs>

            <CreateRuleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newRule) => {
                    toast.success('Auto rule created successfully!');
                    fetchRules();
                }}
            />
        </div>
    );
};
