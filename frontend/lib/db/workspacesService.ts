import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database';

type WorkspaceRow = Database['public']['Tables']['workspaces']['Row'];
type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];
type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update'];
type WorkspaceMemberRow = Database['public']['Tables']['workspace_members']['Row'];
type WorkspaceActivityRow = Database['public']['Tables']['workspace_activity']['Row'];

export const workspacesService = {
    async create(data: WorkspaceInsert, client?: any): Promise<WorkspaceRow> {
        const supabase = client || createClient();
        const { data: workspace, error } = await supabase
            .from('workspaces')
            .insert(data)
            .select()
            .single();
        if (error) throw error;
        return workspace;
    },

    async getBySlug(slug: string, client?: any): Promise<WorkspaceRow | null> {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('slug', slug)
            .maybeSingle();
        if (error) return null;
        return data;
    },

    async getById(id: string, client?: any): Promise<WorkspaceRow | null> {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) return null;
        return data;
    },

    async getUserWorkspaces(userId: string, client?: any) {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspace_members')
            .select(`
                *,
                workspace:workspaces(*)
            `)
            .eq('user_id', userId)
            .eq('status', 'active');

        if (error) throw error;
        return data || [];
    },

    async update(id: string, updates: WorkspaceUpdate, client?: any): Promise<WorkspaceRow> {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspaces')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id: string, client?: any): Promise<void> {
        const supabase = client || createClient();
        const { error } = await supabase
            .from('workspaces')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getMembers(workspaceId: string, client?: any): Promise<WorkspaceMemberRow[]> {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspace_members')
            .select('*')
            .eq('workspace_id', workspaceId)
            .neq('status', 'removed');
        if (error) throw error;
        return data || [];
    },

    async getMembership(workspaceId: string, userId: string, client?: any): Promise<WorkspaceMemberRow | null> {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspace_members')
            .select('*')
            .eq('workspace_id', workspaceId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) return null;
        return data;
    },

    async getActivity(workspaceId: string, client?: any, limit = 50): Promise<WorkspaceActivityRow[]> {
        const supabase = client || createClient();
        const { data, error } = await supabase
            .from('workspace_activity')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data || [];
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async logActivity(data: any, client?: any): Promise<void> {
        const supabase = client || createClient();

        // Standardize legacy log object structures to the updated database schema
        const insertData: Database['public']['Tables']['workspace_activity']['Insert'] = {
            workspace_id: data.workspace_id,
            actor_id: data.actor_id || data.user_id,
            type: data.type || data.action,
            metadata: data.metadata || {
                user_email: data.user_email,
                entity_type: data.entity_type,
                entity_id: data.entity_id,
                entity_name: data.entity_name,
            }
        };

        const { error } = await supabase
            .from('workspace_activity')
            .insert(insertData);
        if (error) console.error('Failed to log workspace activity:', error);
    }
};
