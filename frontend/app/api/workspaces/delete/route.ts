import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';

const deleteSchema = z.object({
    workspaceId: z.string().uuid(),
    confirmName: z.string(),
});

export async function DELETE(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, confirmName } = deleteSchema.parse(body);

        // 1. Verify requester is owner
        const workspace = await workspacesService.getById(workspaceId, supabase);
        if (!workspace || workspace.owner_id !== user.id) {
            return NextResponse.json({ error: 'Only the workspace owner can delete the workspace' }, { status: 403 });
        }

        // 2. Confirm name matches
        if (confirmName !== workspace.name) {
            return NextResponse.json({ error: 'Workspace name confirmation does not match' }, { status: 400 });
        }

        // 3. Clear active_workspace_id for all members
        await (supabase
            .from('profiles') as any)
            .update({ active_workspace_id: null })
            .eq('active_workspace_id', workspaceId);

        // 4. Delete workspace (cascade deletes members, activity, etc.)
        await workspacesService.delete(workspaceId, supabase);

        // 5. Log activity (optional, workspace is gone)
        // Actually activity is cascaded so it's gone.

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete workspace failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
