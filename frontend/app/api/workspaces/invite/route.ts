import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';
import { sendWorkspaceInvitation } from '@/lib/email/invitationEmail';
import { nanoid } from 'nanoid';

const inviteSchema = z.object({
    workspaceId: z.string().uuid(),
    email: z.string().email(),
    role: z.enum(['admin', 'member', 'viewer']),
});

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, email, role } = inviteSchema.parse(body);

        // 1. Verify requester is owner or admin
        const membership = await workspacesService.getMembership(workspaceId, user.id, supabase);
        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const workspace = await workspacesService.getById(workspaceId, supabase);
        if (!workspace) {
            return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
        }

        // 2. Check member limit
        const members = await workspacesService.getMembers(workspaceId, supabase);
        const activeAndPendingCount = members.filter(m => ['active', 'pending'].includes(m.status)).length;
        if (activeAndPendingCount >= workspace.max_members) {
            return NextResponse.json({ error: 'Member limit reached' }, { status: 400 });
        }

        // 3. Check if already a member
        const existingMember = members.find(m => m.invited_email === email && m.status !== 'removed');
        if (existingMember) {
            return NextResponse.json({ error: 'User already invited or a member' }, { status: 400 });
        }

        // 4. Generate token
        const invitationToken = nanoid(32);
        const invitationExpiresAt = new Date();
        invitationExpiresAt.setDate(invitationExpiresAt.getDate() + 7);

        // 5. Insert membership
        const { error: insertError } = await (supabase.from('workspace_members') as any).insert({
            workspace_id: workspaceId,
            invited_email: email,
            role,
            status: 'pending',
            invited_by: user.id,
            invitation_token: invitationToken,
            invitation_expires_at: invitationExpiresAt.toISOString(),
        });

        if (insertError) {
            // If they were previously removed, we might need to update instead
            if (insertError.message.includes('duplicate key value')) {
                const { error: updateError } = await (supabase.from('workspace_members') as any)
                    .update({
                        role,
                        status: 'pending',
                        invited_by: user.id,
                        invitation_token: invitationToken,
                        invitation_expires_at: invitationExpiresAt.toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .match({ workspace_id: workspaceId, invited_email: email });

                if (updateError) throw updateError;
            } else {
                throw insertError;
            }
        }

        // 6. Send invitation email (Fire and forget, do not await)
        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'https';
        const appUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
        sendWorkspaceInvitation({
            inviterName: user.user_metadata?.full_name || user.email || 'A team member',
            inviterEmail: user.email!,
            workspaceName: workspace.name,
            inviteeEmail: email,
            role,
            invitationToken,
            appUrl,
        }).catch(err => console.error("Background email task failed:", err));

        // 7. Log activity (Fire and forget)
        workspacesService.logActivity({
            workspace_id: workspaceId,
            user_id: user.id,
            user_email: user.email,
            action: 'member_invited',
            entity_type: 'member',
            entity_name: email,
            metadata: { role, invited_email: email }
        }, supabase).catch(err => console.error("Background activity logging failed:", err));

        return NextResponse.json({ success: true, invitationToken });
    } catch (error: any) {
        console.error('Workspace invitation failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
