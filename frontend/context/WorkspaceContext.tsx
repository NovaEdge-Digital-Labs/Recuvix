'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';
import { checkPermission, type Permission, type WorkspaceRole } from '@/lib/workspaces/permissionChecker';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'];

type WorkspaceContextType = {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    activeMembership: WorkspaceMember | null;
    activeRole: WorkspaceRole | null;
    isWorkspaceMode: boolean;
    isLoading: boolean;
    refreshWorkspaces: () => Promise<void>;
    setActiveWorkspace: (id: string | null) => Promise<void>;
    can: (permission: Permission) => boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
    workspaces: [],
    activeWorkspace: null,
    activeMembership: null,
    activeRole: null,
    isWorkspaceMode: false,
    isLoading: true,
    refreshWorkspaces: async () => { },
    setActiveWorkspace: async () => { },
    can: () => false,
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const { user, profile } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [activeWorkspace, setActiveWs] = useState<Workspace | null>(null);
    const [activeMembership, setActiveMembership] = useState<WorkspaceMember | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const activeRole = (activeMembership?.role as WorkspaceRole) || null;

    const fetchWorkspaces = useCallback(async () => {
        if (!user) {
            setWorkspaces([]);
            setIsLoading(false);
            return;
        }

        try {
            // 1. Fetch workpaces where I am a member or owner
            // RLS handles the security: auth.uid() = owner_id OR check_is_workspace_member(id)
            const { data: wsData, error: wsError } = await supabase
                .from('workspaces')
                .select('*');

            if (wsError) throw wsError;
            const wsList = wsData || [];

            // 2. Fetch my membership details for the roles
            const { data: mData, error: mError } = await supabase
                .from('workspace_members')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active');

            if (mError) throw mError;

            // 3. Combine them into the structure the app expects
            const typedWsList = (wsList || []) as any[];
            const typedMData = (mData || []) as any[];

            const combined = typedWsList.map(ws => {
                const membership = typedMData.find(m => m.workspace_id === ws.id);
                return {
                    ...ws,
                    role: (membership?.role as WorkspaceRole) || (ws.owner_id === user.id ? 'owner' : 'viewer'),
                };
            });

            setWorkspaces(combined as any);

            // 4. Set active workspace if saved in profile
            if (profile?.active_workspace_id) {
                const ws = typedWsList.find(w => w.id === profile.active_workspace_id);
                if (ws) {
                    setActiveWs(ws);
                    const membership = typedMData.find(m => m.workspace_id === ws.id);
                    setActiveMembership(membership || null);
                }
            }
        } catch (error) {
            console.error('Failed to fetch workspaces:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, profile?.active_workspace_id]);

    const setActiveWorkspace = useCallback(async (id: string | null) => {
        if (!user) return;

        if (!id) {
            setActiveWs(null);
            setActiveMembership(null);
            await (supabase.from('profiles') as any)
                .update({ active_workspace_id: null })
                .eq('id', user.id);
            return;
        }

        const ws = workspaces.find(w => w.id === id);
        if (!ws) return;

        try {
            const { data: membership, error } = await supabase
                .from('workspace_members')
                .select('*')
                .eq('workspace_id', id)
                .eq('user_id', user.id)
                .eq('status', 'active')
                .single();

            if (error) throw error;

            setActiveWs(ws);
            setActiveMembership(membership);

            await (supabase.from('profiles') as any)
                .update({ active_workspace_id: id })
                .eq('id', user.id);
        } catch (error) {
            console.error('Failed to set active workspace:', error);
        }
    }, [user, workspaces]);

    const can = useCallback((permission: Permission) => {
        return checkPermission(activeRole, permission);
    }, [activeRole]);

    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);

    const value = useMemo(() => ({
        workspaces,
        activeWorkspace,
        activeMembership,
        activeRole,
        isWorkspaceMode: !!activeWorkspace,
        isLoading,
        refreshWorkspaces: fetchWorkspaces,
        setActiveWorkspace,
        can,
    }), [workspaces, activeWorkspace, activeMembership, activeRole, isLoading, fetchWorkspaces, setActiveWorkspace, can]);

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export const useWorkspace = () => useContext(WorkspaceContext);
