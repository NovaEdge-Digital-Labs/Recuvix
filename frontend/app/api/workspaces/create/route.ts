import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWorkspaceSlug, ensureUniqueSlug } from '@/lib/workspaces/slugGenerator';
import { workspacesService } from '@/lib/db/workspacesService';

const createSchema = z.object({
    name: z.string().min(2).max(50),
    slug: z.string().optional(),
    description: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createSchema.parse(body);

        let baseSlug = validatedData.slug || generateWorkspaceSlug(validatedData.name);
        const slug = await ensureUniqueSlug(baseSlug, supabase);

        // Create workspace directly using authenticated server client
        const tenantHeader = req.headers.get('x-recuvix-tenant');
        const tenantInfo = tenantHeader ? JSON.parse(tenantHeader) : null;
        const tenantId = tenantInfo?.id || null;

        const { data: workspace, error: createError } = await (supabase
            .from('workspaces' as any) as any)
            .insert({
                name: validatedData.name,
                slug,
                description: validatedData.description,
                owner_id: user.id,
                plan: 'agency',
                credits_balance: 0,
                tenant_id: tenantId,
            })
            .select()
            .single();

        if (createError) throw createError;

        // Add owner as active member
        const { error: memberError } = await (supabase.from('workspace_members') as any).insert({
            workspace_id: workspace.id,
            user_id: user.id,
            role: 'owner',
            status: 'active',
            joined_at: new Date().toISOString(),
            invited_email: user.email,
        });

        if (memberError) {
            console.error('Failed to create workspace membership:', memberError);
            // Cleanup the workspace if membership fails
            await (supabase.from('workspaces') as any).delete().eq('id', workspace.id);
            throw memberError;
        }

        // Log activity
        await workspacesService.logActivity({
            workspace_id: workspace.id,
            user_id: user.id,
            user_email: user.email,
            action: 'workspace_created',
            entity_type: 'workspace',
            entity_id: workspace.id,
            entity_name: workspace.name,
        }, supabase);

        return NextResponse.json({ workspace });
    } catch (error: any) {
        console.error('Workspace creation failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
