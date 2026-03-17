import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';

const removeSchema = z.object({
    workspaceId: z.string().uuid(),
    memberId: z.string().uuid(),
});

export async function DELETE(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, memberId } = removeSchema.parse(body);

        // 1. Verify requester is owner or admin
        const requesterMembership = await workspacesService.getMembership(workspaceId, user.id, supabase);
        if (!requesterMembership || !['owner', 'admin'].includes(requesterMembership.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // 2. Find target member
        const { data: targetMember, error: fetchError } = await (supabase
            .from('workspace_members') as any)
            .select('*')
            .eq('id', memberId)
            .single();

        if (fetchError || !targetMember) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        // 3. Cannot remove owner
        if (targetMember.role === 'owner') {
            return NextResponse.json({ error: 'Cannot remove the workspace owner' }, { status: 400 });
        }

        // 4. Update status to removed
        const { error: updateError } = await (supabase
            .from('workspace_members') as any)
            .update({ status: 'removed', updated_at: new Date().toISOString() })
            .eq('id', memberId);

        if (updateError) throw updateError;

        // 5. Log activity
        await workspacesService.logActivity({
            workspace_id: workspaceId,
            user_id: user.id,
            user_email: user.email,
            action: 'member_removed',
            entity_type: 'member',
            entity_id: targetMember.user_id,
            entity_name: targetMember.invited_email,
        }, supabase);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Remove member failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
