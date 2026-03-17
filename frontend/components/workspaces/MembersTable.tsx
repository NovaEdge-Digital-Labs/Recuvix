"use client";

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    MoreHorizontal,
    UserMinus,
    Shield,
    User,
    Eye,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '@/context/WorkspaceContext';

interface Member {
    id: string;
    email: string;
    role: string;
    status: string;
    joined_at?: string;
}

export function MembersTable({ members }: { members: Member[] }) {
    const { activeRole, can, activeWorkspace } = useWorkspace();

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'owner': return <Badge variant="secondary" className="gap-1"><Shield className="size-3" /> Owner</Badge>;
            case 'admin': return <Badge variant="outline" className="gap-1 border-blue-500 text-blue-500"><Shield className="size-3" /> Admin</Badge>;
            case 'member': return <Badge variant="outline" className="gap-1 border-slate-500 text-slate-500"><User className="size-3" /> Member</Badge>;
            case 'viewer': return <Badge variant="outline" className="gap-1 border-slate-300 text-slate-400"><Eye className="size-3" /> Viewer</Badge>;
            default: return <Badge variant="outline">{role}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return <Badge variant="outline" className="gap-1 border-green-500 text-green-500"><CheckCircle2 className="size-3" /> Active</Badge>;
            case 'pending': return <Badge variant="outline" className="gap-1 border-amber-500 text-amber-500 animate-pulse"><Clock className="size-3" /> Pending</Badge>;
            case 'removed': return <Badge variant="destructive">Removed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleRemove = async (memberId: string) => {
        if (!activeWorkspace) return;

        try {
            const res = await fetch('/api/workspaces/remove-member', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workspaceId: activeWorkspace.id,
                    memberId: memberId
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to remove member');
            }

            toast.success("Member removed successfully. Please refresh.");
            // Optionally, trigger a re-fetch of members here if there's a prop or context for it
        } catch (error: any) {
            toast.error(error.message || 'An error occurred while removing the member');
        }
    };

    const handleRoleChange = async (memberId: string, newRole: string) => {
        // Implementation for changing role
        toast.info(`Changing role to ${newRole}...`);
    };

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell className="py-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-8">
                                        <AvatarFallback>{member.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{member.email || 'Unknown User'}</span>
                                        {member.joined_at && (
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                                Joined {new Date(member.joined_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {getRoleBadge(member.role)}
                            </TableCell>
                            <TableCell>
                                {getStatusBadge(member.status)}
                            </TableCell>
                            <TableCell className="text-right">
                                {can('invite_members') && member.role !== 'owner' && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                                                Make Admin
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                                                Make Member
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'viewer')}>
                                                Make Viewer
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleRemove(member.id)}
                                            >
                                                <UserMinus className="mr-2 size-4" />
                                                Remove from Workspace
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
