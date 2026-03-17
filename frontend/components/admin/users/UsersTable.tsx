"use client";

import React, { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { UserStatsRow } from './UserStatsRow';
import { UserSearchFilters } from './UserSearchFilters';
import { UserRow } from './UserRow';
import { UserDetailPanel } from './UserDetailPanel';
import { ReferralTreeModal } from './ReferralTreeModal';
import { QuickGrantModal } from './QuickGrantModal';
import { SuspendModal } from './SuspendModal';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UsersTable = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        search: '',
        label: 'all',
        isSuspended: 'all',
        mode: 'all',
        sortBy: 'created_at',
        sortOrder: 'desc',
        page: 1,
        limit: 10
    });

    // Modals state
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isTreeOpen, setIsTreeOpen] = useState(false);
    const [isGrantOpen, setIsGrantOpen] = useState(false);
    const [isSuspendOpen, setIsSuspendOpen] = useState(false);

    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilters(filters), 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const { data: userData, error, mutate } = useSWR(() => {
        const sp = new URLSearchParams();
        if (debouncedFilters.search) sp.set('search', debouncedFilters.search);
        if (debouncedFilters.label !== 'all') sp.set('label', debouncedFilters.label);
        if (debouncedFilters.isSuspended !== 'all') sp.set('isSuspended', debouncedFilters.isSuspended);
        if (debouncedFilters.mode !== 'all') sp.set('managedMode', debouncedFilters.mode === 'managed' ? 'true' : 'false');
        sp.set('sortBy', debouncedFilters.sortBy);
        sp.set('sortOrder', debouncedFilters.sortOrder);
        sp.set('page', debouncedFilters.page.toString());
        sp.set('limit', debouncedFilters.limit.toString());
        return `/api/admin/users?${sp.toString()}`;
    }, fetcher);

    useEffect(() => {
        if (userData?.users) {
            setUsers(userData.users);
            setTotal(userData.total);
            setStats(userData.stats);
            setLoading(false);
        } else if (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        } else if (!userData) {
            setLoading(true);
        }
    }, [userData, error]);

    const fetchUsers = useCallback(() => {
        mutate();
    }, [mutate]);

    const handleUpdateUser = (updatedUser: any) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    };

    const handleUpdateLabel = async (userId: string, label: string) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userLabel: label === 'none' ? null : label })
            });
            const data = await response.json();
            if (data.success) {
                handleUpdateUser(data.user);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnsuspend = async (user: any) => {
        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSuspended: false, suspendedReason: null })
            });
            const data = await response.json();
            if (data.success) {
                handleUpdateUser(data.user);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {stats && <UserStatsRow stats={stats} />}

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-900 bg-zinc-950/50">
                    <UserSearchFilters filters={filters} setFilters={setFilters} />
                </div>

                <div className="overflow-x-auto">
                    {loading && users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            <div className="text-zinc-500 text-sm font-medium">Fetching users...</div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-900/40 text-zinc-500 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-900">
                                    <th className="py-3 pl-4 pr-3">User</th>
                                    <th className="px-3 py-3">Label / Tenant</th>
                                    <th className="px-3 py-3">Credits</th>
                                    <th className="px-3 py-3">Referrals</th>
                                    <th className="px-3 py-3">Blogs</th>
                                    <th className="px-3 py-3">Joined</th>
                                    <th className="px-3 py-3 text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900/50">
                                {users.map((user) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        onViewDetails={(u) => { setSelectedUser(u); setIsDetailOpen(true); }}
                                        onViewTree={(u) => { setSelectedUser(u); setIsTreeOpen(true); }}
                                        onGiveCredits={(u) => { setSelectedUser(u); setIsGrantOpen(true); }}
                                        onSuspend={(u) => { setSelectedUser(u); setIsSuspendOpen(true); }}
                                        onUnsuspend={handleUnsuspend}
                                        onUpdateLabel={handleUpdateLabel}
                                    />
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center text-zinc-600 italic">
                                            No users found matching filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
                    <div className="text-xs text-zinc-600 font-medium">
                        Showing <span className="text-white">{(filters.page - 1) * filters.limit + 1}</span>-
                        <span className="text-white">{Math.min(filters.page * filters.limit, total)}</span> of <span className="text-white">{total}</span> users
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-xs font-bold text-zinc-400">Page {filters.page}</div>
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={filters.page * filters.limit >= total}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Slide-in Detail Panel */}
            <UserDetailPanel
                user={selectedUser}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onUpdate={handleUpdateUser}
            />

            {/* Modals */}
            <ReferralTreeModal
                user={selectedUser}
                isOpen={isTreeOpen}
                onClose={() => setIsTreeOpen(false)}
            />

            <QuickGrantModal
                user={selectedUser}
                isOpen={isGrantOpen}
                onClose={() => setIsGrantOpen(false)}
                onSuccess={(result) => {
                    if (selectedUser) {
                        handleUpdateUser({
                            ...selectedUser,
                            credits_balance: result.newBalance
                        });
                    }
                }}
            />

            <SuspendModal
                user={selectedUser}
                isOpen={isSuspendOpen}
                onClose={() => setIsSuspendOpen(false)}
                onSuccess={(result) => handleUpdateUser(result.user)}
            />
        </div>
    );
};
