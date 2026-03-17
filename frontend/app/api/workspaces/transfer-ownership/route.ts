import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';

const transferSchema = z.object({
    workspaceId: z.string().uuid(),
    newOwnerId: z.string().uuid(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, newOwnerId } = transferSchema.parse(body);

        // 1. Verify requester is owner
        const workspace = await workspacesService.getById(workspaceId, supabase);
        if (!workspace || workspace.owner_id !== user.id) {
            return NextResponse.json({ error: 'Only the workspace owner can transfer ownership' }, { status: 403 });
        }

        // 2. Verify new owner is an active member and an admin
        const newOwnerMembership = await workspacesService.getMembership(workspaceId, newOwnerId, supabase);
        if (!newOwnerMembership || newOwnerMembership.status !== 'active' || newOwnerMembership.role !== 'admin') {
            return NextResponse.json({ error: 'The new owner must be an active admin of the workspace' }, { status: 400 });
        }

        // 3. Update workspace owner_id
        const { error: workspaceError } = await (supabase
            .from('workspaces') as any)
            .update({ owner_id: newOwnerId, updated_at: new Date().toISOString() })
            .eq('id', workspaceId);

        if (workspaceError) throw workspaceError;

        // 4. Update member roles
        // Old owner becomes admin
        await (supabase
            .from('workspace_members') as any)
            .update({ role: 'admin', updated_at: new Date().toISOString() })
            .eq('workspace_id', workspaceId)
            .eq('user_id', user.id);

        // New owner becomes owner
        await (supabase
            .from('workspace_members') as any)
            .update({ role: 'owner', updated_at: new Date().toISOString() })
            .eq('workspace_id', workspaceId)
            .eq('user_id', newOwnerId);

        // 5. Log activity
        await workspacesService.logActivity({
            workspace_id: workspaceId,
            user_id: user.id,
            user_email: user.email,
            action: 'ownership_transferred',
            entity_type: 'workspace',
            entity_id: workspaceId,
            entity_name: workspace.name,
            metadata: { oldOwnerId: user.id, newOwnerId }
        }, supabase);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Transfer ownership failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
