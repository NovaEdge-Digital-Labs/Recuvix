import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { injectLinks } from '@/lib/linking/linkInjector';

const ApplySuggestionsSchema = z.object({
    blogId: z.string().uuid(),
    suggestionIds: z.array(z.string().uuid()),
    baseUrl: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = ApplySuggestionsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request', details: result.error.format() }, { status: 400 });
        }

        const { blogId, suggestionIds, baseUrl } = result.data;

        // 1. Load blog from Supabase
        const { data: blog, error: blogError } = await (supabase
            .from('blogs') as any)
            .select('*')
            .eq('id', blogId)
            .single();

        if (blogError || !blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // 2. Load suggestions
        const { data: suggestions, error: suggestionsError } = await (supabase
            .from('internal_link_suggestions') as any)
            .select('*')
            .in('id', suggestionIds)
            .eq('source_blog_id', blogId)
            .eq('status', 'approved');

        if (suggestionsError || !suggestions || suggestions.length === 0) {
            return NextResponse.json({ error: 'No approved suggestions found to apply' }, { status: 400 });
        }

        // 3. Inject links
        // Map DB suggestions to internal LinkSuggestion type
        const mappedSuggestions = (suggestions as any[]).map((s: any) => ({
            id: s.id,
            sourceBlogId: s.source_blog_id,
            targetBlogId: s.target_blog_id,
            targetTitle: s.target_title,
            targetSlug: s.target_slug,
            targetUrl: s.target_url,
            targetFocusKeyword: s.target_focus_keyword,
            anchorText: s.anchor_text,
            contextSentence: s.context_sentence,
            sectionH2: s.section_h2,
            placementType: s.placement_type as any,
            relevanceScore: s.relevance_score,
            scoreBreakdown: s.score_breakdown,
            status: s.status as any,
        }));

        const injectionResult = injectLinks((blog as any).blog_html || '', mappedSuggestions);

        // 4. Save modified blog HTML back to Supabase
        const { error: updateError } = await (supabase
            .from('blogs') as any)
            .update({
                blog_html: injectionResult.modifiedHtml,
                // We probably should update blog_markdown too if possible, but the requirement specifically says blog_html
                updated_at: new Date().toISOString(),
            })
            .eq('id', blogId);

        if (updateError) {
            throw new Error(`Failed to update blog: ${updateError.message}`);
        }

        // 5. Mark suggestions as 'applied'
        await (supabase
            .from('internal_link_suggestions') as any)
            .update({
                status: 'applied',
                applied_at: new Date().toISOString(),
            })
            .in('id', suggestionIds);

        // 6. Insert applied links records
        const appliedLinksToInsert = (suggestions as any[]).map((s: any) => ({
            user_id: user.id,
            workspace_id: blog.workspace_id,
            source_blog_id: blogId,
            target_blog_id: s.target_blog_id,
            anchor_text: s.anchor_text,
            target_url: s.target_url,
            section_h2: s.section_h2,
            suggestion_id: s.id,
            applied_at: new Date().toISOString(),
        }));

        const { error: linkInsertError } = await (supabase
            .from('applied_internal_links') as any)
            .insert(appliedLinksToInsert);

        if (linkInsertError) {
            console.error('Failed to insert applied links:', linkInsertError);
        }

        // 7. Update link counts (handled by SQL functions if we call them, or just increment)
        // We'll update the blogs table's internal_links_count
        // For source: outbound links increased. For targets: inbound links increased.
        // In V1, we'll let the next analysis refresh the count or run a quick update

        return NextResponse.json({
            appliedCount: injectionResult.appliedCount,
            skippedCount: injectionResult.skippedCount,
            skippedReasons: injectionResult.skippedReasons,
            updatedBlogId: blogId,
        });

    } catch (error: any) {
        console.error('Apply Suggestions Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
