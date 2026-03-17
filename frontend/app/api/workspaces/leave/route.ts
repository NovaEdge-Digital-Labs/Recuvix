import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';

const leaveSchema = z.object({
    workspaceId: z.string().uuid(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId } = leaveSchema.parse(body);

        // 1. Find membership
        const membership = await workspacesService.getMembership(workspaceId, user.id, supabase);
        if (!membership || membership.status !== 'active') {
            return NextResponse.json({ error: 'You are not an active member of this workspace' }, { status: 400 });
        }

        // 2. Owner cannot leave without transferring ownership
        if (membership.role === 'owner') {
            return NextResponse.json({ error: 'Owners must transfer ownership before leaving' }, { status: 400 });
        }

        // 3. Mark as removed
        const { error: updateError } = await (supabase
            .from('workspace_members') as any)
            .update({ status: 'removed', updated_at: new Date().toISOString() })
            .eq('id', membership.id);

        if (updateError) throw updateError;

        // 4. Update profile if active workspace
        const { data: profile } = await (supabase
            .from('profiles') as any)
            .select('active_workspace_id')
            .eq('id', user.id)
            .single();

        if (profile?.active_workspace_id === workspaceId) {
            await (supabase
                .from('profiles') as any)
                .update({ active_workspace_id: null })
                .eq('id', user.id);
        }

        // 5. Log activity
        await workspacesService.logActivity({
            workspace_id: workspaceId,
            user_id: user.id,
            user_email: user.email,
            action: 'member_left',
            entity_type: 'member',
            entity_id: user.id,
            entity_name: user.email,
        }, supabase);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Leave workspace failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
