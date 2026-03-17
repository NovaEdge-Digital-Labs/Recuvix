'use client';

import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { WorkspaceCard } from '@/components/workspaces/WorkspaceCard';
import { CreateWorkspaceModal } from '@/components/workspaces/CreateWorkspaceModal';
import { PendingInvitationCard } from '@/components/workspaces/PendingInvitationCard';
import { Button } from '@/components/ui/button';
import { Plus, Building2, LayoutDashboard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorkspacesPage() {
    const { workspaces, activeWorkspace, setActiveWorkspace, isLoading } = useWorkspace();
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [isInvitationsLoading, setIsInvitationsLoading] = useState(true);

    useEffect(() => {
        const fetchInvitations = async () => {
            try {
                const res = await fetch('/api/workspaces/invitations/pending');
                if (res.ok) {
                    const data = await res.json();
                    setInvitations(data.invitations || []);
                }
            } catch (error) {
                console.error('Failed to fetch invitations:', error);
            } finally {
                setIsInvitationsLoading(false);
            }
        };

        if (user) {
            fetchInvitations();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading workspaces...</p>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-8 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Workspaces</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your blog networks and team collaborations.
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    New Workspace
                </Button>
            </div>

            {/* Invitations Section */}
            {invitations.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Pending Invitations
                        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                            {invitations.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {invitations.map((invitation) => (
                            <PendingInvitationCard
                                key={invitation.id}
                                invitation={invitation}
                                onAction={() => {
                                    setInvitations(invs => invs.filter(i => i.id !== invitation.id));
                                    // Refresh workspaces if invitation was accepted
                                    // (Simplification: just refresh whole page for now)
                                    window.location.reload();
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Workspaces Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">All Workspaces</h2>
                {workspaces.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border-2 border-dashed">
                        <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No workspaces found</h3>
                        <p className="text-muted-foreground text-sm max-w-xs text-center mt-2 mb-6">
                            You aren't a member of any workspaces yet. Create one to get started!
                        </p>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Workspace
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workspaces.map((workspace: any) => (
                            <WorkspaceCard
                                key={workspace.id}
                                workspace={workspace}
                                memberCount={workspace.member_count || 1}
                                role={workspace.role}
                                isActive={activeWorkspace?.id === workspace.id}
                                onSwitch={setActiveWorkspace}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateWorkspaceModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </div>
    );
}
