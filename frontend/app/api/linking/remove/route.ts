import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { removeLinkFromHtml } from '@/lib/linking/linkInjector';

const RemoveLinkSchema = z.object({
    blogId: z.string().uuid(),
    appliedLinkId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = RemoveLinkSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request', details: result.error.format() }, { status: 400 });
        }

        const { blogId, appliedLinkId } = result.data;

        // 1. Load blog_html from Supabase
        const { data: blog, error: blogError } = await (supabase
            .from('blogs') as any)
            .select('id, blog_html')
            .eq('id', blogId)
            .single();

        if (blogError || !blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // 2. Load applied_internal_links record
        const { data: appliedLink, error: linkError } = await (supabase
            .from('applied_internal_links') as any)
            .select('*')
            .eq('id', appliedLinkId)
            .eq('source_blog_id', blogId)
            .single();

        if (linkError || !appliedLink) {
            return NextResponse.json({ error: 'Applied link record not found' }, { status: 404 });
        }

        // 3. Call removeLink() from linkInjector
        const modifiedHtml = removeLinkFromHtml(
            blog.blog_html || '',
            appliedLink.anchor_text,
            appliedLink.target_url
        );

        // 4. Save modified blog_html back to Supabase
        const { error: updateError } = await (supabase
            .from('blogs') as any)
            .update({
                blog_html: modifiedHtml,
                updated_at: new Date().toISOString(),
            })
            .eq('id', blogId);

        if (updateError) {
            throw new Error(`Failed to update blog HTML: ${updateError.message}`);
        }

        // 5. Mark applied_internal_links record as inactive
        await (supabase
            .from('applied_internal_links') as any)
            .update({
                is_active: false,
                removed_at: new Date().toISOString(),
                removed_reason: 'User manual removal',
            })
            .eq('id', appliedLinkId);

        return NextResponse.json({ success: true, removedLinkId: appliedLinkId });

    } catch (error: any) {
        console.error('Remove Link Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
