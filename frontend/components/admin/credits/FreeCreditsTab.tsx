"use client";

import React, { useState } from 'react';
import {
    Plus,
    Settings2,
    Users,
    History,
    Sparkles,
    Search,
    Filter
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const FreeCreditsTab = () => {
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
                    <Button variant="outline" className="bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white h-10 px-4">
                        <History className="w-4 h-4 mr-2" />
                        Grant History
                    </Button>
                    <Button className="bg-accent hover:bg-accent/90 text-black font-bold h-10 px-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Rule Cards will go here */}
                        <div className="col-span-full py-20 bg-zinc-950 border border-zinc-900 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                <Settings2 className="w-8 h-8" />
                            </div>
                            <div className="text-center space-y-1">
                                <div className="text-white font-bold">No active rules</div>
                                <div className="text-zinc-500 text-sm">Create your first automated credit rule to reward users.</div>
                            </div>
                            <Button className="bg-zinc-900 border border-zinc-800 text-white font-bold h-9 px-6 hover:bg-zinc-800">
                                Create First Rule
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-6 outline-none">
                    {/* Manual Grant Interface will go here */}
                    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 text-center space-y-4">
                        <div className="text-white font-bold text-xl">Selective Bulk Grants</div>
                        <p className="text-zinc-500 max-w-lg mx-auto">
                            Choose specific segments of users or target everyone at once to distribute promotional credits.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <Button variant="outline" className="bg-zinc-900 border-zinc-800 h-10 px-8 font-bold">Target Segment</Button>
                            <Button className="bg-accent text-black font-bold h-10 px-8">Grant Everyone</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
