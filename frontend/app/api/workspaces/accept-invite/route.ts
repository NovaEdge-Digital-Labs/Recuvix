import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { workspacesService } from '@/lib/db/workspacesService';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/workspaces?error=missing_token', req.url));
    }

    try {
        const supabase = await createServerSupabaseClient();

        // 1. Find membership by token
        const { data: membership, error: fetchError } = await (supabase
            .from('workspace_members') as any)
            .select('*, workspace:workspaces(*)')
            .eq('invitation_token', token)
            .single();

        if (fetchError || !membership) {
            return NextResponse.redirect(new URL('/workspaces?error=invalid_token', req.url));
        }

        // 2. Verify status and expiry
        if (membership.status !== 'pending') {
            return NextResponse.redirect(new URL(`/workspace/${membership.workspace.slug}`, req.url));
        }

        if (new Date(membership.invitation_expires_at) < new Date()) {
            return NextResponse.redirect(new URL('/workspaces?error=token_expired', req.url));
        }

        // 3. Check auth
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            // Redirect to signup with invite token
            return NextResponse.redirect(new URL(`/signup?invite_token=${token}&email=${membership.invited_email}`, req.url));
        }

        // 4. Update membership
        const { error: updateError } = await (supabase
            .from('workspace_members') as any)
            .update({
                user_id: user.id,
                status: 'active',
                joined_at: new Date().toISOString(),
                invitation_token: null,
            })
            .eq('id', membership.id);

        if (updateError) throw updateError;

        // 5. Update profile active workspace
        await (supabase
            .from('profiles') as any)
            .update({ active_workspace_id: membership.workspace_id })
            .eq('id', user.id);

        // 6. Log activity
        await workspacesService.logActivity({
            workspace_id: membership.workspace_id,
            actor_id: user.id,
            type: 'member_joined',
            metadata: {
                user_email: user.email,
                entity_type: 'member',
                entity_id: user.id,
                entity_name: user.email,
            }
        }, supabase);

        return NextResponse.redirect(new URL(`/workspace/${membership.workspace.slug}`, req.url));
    } catch (error) {
        console.error('Accept invitation failed:', error);
        return NextResponse.redirect(new URL('/workspaces?error=server_error', req.url));
    }
}
