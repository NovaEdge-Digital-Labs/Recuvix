"use client";

import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MembersTable } from '@/components/workspaces/MembersTable';
import { InviteMemberModal } from '@/components/workspaces/InviteMemberModal';
import { workspacesService } from '@/lib/db/workspacesService';
import { toast } from 'sonner';

export default function WorkspaceMembersPage() {
    const { activeWorkspace, can } = useWorkspace();
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = async () => {
        if (!activeWorkspace) return;
        try {
            const data = await workspacesService.getMembers(activeWorkspace.id);
            setMembers(data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
            toast.error('Failed to load team members');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [activeWorkspace?.id]);

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
                    <p className="text-muted-foreground">
                        Manage your team, roles, and invitations for <span className="font-medium text-foreground">{activeWorkspace.name}</span>.
                    </p>
                </div>
                {can('invite_members') && (
                    <InviteMemberModal />
                )}
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Members</CardTitle>
                    <CardDescription>
                        A list of all users who have access to this workspace.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-16 w-full animate-pulse bg-muted rounded-md" />
                            ))}
                        </div>
                    ) : (
                        <MembersTable members={members} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
