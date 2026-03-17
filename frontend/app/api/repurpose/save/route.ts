import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const SaveRepurposeSchema = z.object({
    blogId: z.string().uuid(),
    format: z.string(),
    content: z.record(z.string(), z.any()),
    model: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = SaveRepurposeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request data', details: result.error.format() }, { status: 400 });
        }

        const { blogId, format, content, model } = result.data;

        // 1. Get current repurposed_content and verify ownership/access
        const { data: blog, error: fetchError } = await (supabase
            .from('blogs') as any)
            .select('id, user_id, workspace_id, repurposed_content')
            .eq('id', blogId)
            .single();

        if (fetchError || !blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Check ownership
        let hasAccess = blog.user_id === session.user.id;

        // Check workspace access if not owner
        if (!hasAccess && blog.workspace_id) {
            const { data: isMember } = await (supabase as any).rpc('check_is_workspace_member', {
                ws_id: (blog as any).workspace_id
            });
            if (isMember) hasAccess = true;
        }

        if (!hasAccess) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Merge new content
        const existingContent = (blog.repurposed_content as Record<string, any>) || {};
        const updatedRepurposedContent = {
            ...existingContent,
            [format]: {
                ...content,
                generatedAt: new Date().toISOString(),
                model,
                edited: false,
            }
        };

        // 3. Update blog
        const { error: updateError } = await (supabase
            .from('blogs') as any)
            .update({ repurposed_content: updatedRepurposedContent })
            .eq('id', blogId);

        if (updateError) {
            throw updateError;
        }

        // 4. Log workspace activity if applicable
        if (blog.workspace_id) {
            await (supabase.from('workspace_activity') as any).insert({
                workspace_id: (blog as any).workspace_id,
                actor_id: session.user.id,
                type: 'blog_repurpose', // Fixed type name if needed, or kept matches
                metadata: { blog_id: blogId, format }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Save Repurpose Error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
