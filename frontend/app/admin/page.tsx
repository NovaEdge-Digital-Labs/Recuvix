"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Key,
    BarChart3,
    Settings2,
    Users,
    ShieldCheck,
    LayoutDashboard,
    Sparkles
} from "lucide-react";

// Components
import { KeysTab } from "@/components/admin/KeysTab";
import { UsageTab } from "@/components/admin/UsageTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { UsersTab } from "@/components/admin/users/UsersTab";
import { AgenciesTab } from "@/components/admin/agencies/AgenciesTab";
import { FreeCreditsTab } from "@/components/admin/credits/FreeCreditsTab";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("keys");

    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent/30 font-sans">
            {/* Header */}
            <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-black" />
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">Recuvix <span className="text-zinc-500 font-medium italic">Control</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[12px] font-medium text-zinc-400">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            System Live
                        </div>
                        <button
                            onClick={() => {
                                document.cookie = "admin_key=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                window.location.href = "/admin/login";
                            }}
                            className="text-sm text-zinc-500 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6 space-y-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Platform Control Center</h2>
                    <p className="text-zinc-500">Manage API infrastructure, oversee users, and automate growth engines.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-zinc-900/50 border border-zinc-900 p-1.5 h-12 inline-flex rounded-xl">
                        <TabsTrigger value="keys" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg gap-2 h-full px-4 text-xs font-bold uppercase tracking-wider">
                            <Key className="w-4 h-4" />
                            API Keys
                        </TabsTrigger>
                        <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg gap-2 h-full px-4 text-xs font-bold uppercase tracking-wider">
                            <BarChart3 className="w-4 h-4" />
                            Monitoring
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg gap-2 h-full px-4 text-xs font-bold uppercase tracking-wider">
                            <Users className="w-4 h-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="agencies" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg gap-2 h-full px-4 text-xs font-bold uppercase tracking-wider">
                            <LayoutDashboard className="w-4 h-4" />
                            Agencies
                        </TabsTrigger>
                        <TabsTrigger value="credits" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg gap-2 h-full px-4 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            Credits
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white rounded-lg gap-2 h-full px-4 text-xs font-bold uppercase tracking-wider">
                            <Settings2 className="w-4 h-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="keys" className="mt-0 focus-visible:outline-none">
                        <KeysTab />
                    </TabsContent>

                    <TabsContent value="usage" className="mt-0 focus-visible:outline-none">
                        <UsageTab />
                    </TabsContent>

                    <TabsContent value="users" className="mt-0 focus-visible:outline-none">
                        <UsersTab />
                    </TabsContent>

                    <TabsContent value="agencies" className="mt-0 focus-visible:outline-none">
                        <AgenciesTab />
                    </TabsContent>

                    <TabsContent value="credits" className="mt-0 focus-visible:outline-none">
                        <FreeCreditsTab />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                        <SettingsTab />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
