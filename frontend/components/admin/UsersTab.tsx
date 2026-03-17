"use client";

import { useState, useEffect } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCog, Coins, Zap } from "lucide-react";

export function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (!error && data) {
            setUsers(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users by email or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border-zinc-800 rounded-lg pl-10 pr-4 h-11 text-sm focus:ring-accent focus:border-accent"
                    />
                </div>
            </div>

            <Card className="bg-zinc-950 border-zinc-900 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-zinc-900/50 border-b border-zinc-900 text-zinc-500">
                                <th className="p-4 font-semibold uppercase text-[10px] tracking-widest">User</th>
                                <th className="p-4 font-semibold uppercase text-[10px] tracking-widest">Plan</th>
                                <th className="p-4 font-semibold uppercase text-[10px] tracking-widest">Credits</th>
                                <th className="p-4 font-semibold uppercase text-[10px] tracking-widest">Status</th>
                                <th className="p-4 font-semibold uppercase text-[10px] tracking-widest">Created</th>
                                <th className="p-4 font-semibold uppercase text-[10px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/50">
                            {filteredUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{user.full_name || 'No Name'}</span>
                                            <span className="text-xs text-zinc-500">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.plan === 'pro' ? 'bg-purple-500/10 text-purple-500' :
                                            user.plan === 'agency' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-zinc-500/10 text-zinc-500'
                                            }`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-zinc-300">{user.credits_balance}</td>
                                    <td className="p-4">
                                        {user.managed_mode_enabled ? (
                                            <span className="text-[10px] text-green-500 flex items-center gap-1 font-bold italic">
                                                <Zap className="w-3 h-3" /> Managed Ready
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-zinc-600 font-bold uppercase">BYOK Only</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-zinc-500 text-xs">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                <Coins className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                <UserCog className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
