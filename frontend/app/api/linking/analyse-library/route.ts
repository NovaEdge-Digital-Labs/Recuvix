import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { buildIndexEntry, buildLibraryIndex } from '@/lib/linking/libraryIndexBuilder';
import { computeLinkSuggestions } from '@/lib/linking/linkingEngine';

// SIMPLE IN-MEMORY JOB STORE FOR V1
// Note: In production this should be in Redis/DB for persistence
const jobs = new Map<string, {
    status: 'running' | 'completed' | 'failed';
    total: number;
    processed: number;
    suggestionsFound: number;
    error?: string;
}>();

const AnalyseLibrarySchema = z.object({
    workspaceId: z.string().uuid().optional(),
    forceRefresh: z.boolean().optional().default(false),
    baseUrl: z.string().url().optional(),
});

/**
 * Endpoint for library-wide analysis.
 * For now, this runs synchronously but we can easily transition to background.
 */
export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = AnalyseLibrarySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request', details: result.error.format() }, { status: 400 });
        }

        const { workspaceId, forceRefresh, baseUrl } = result.data;

        // 1. Load all blogs for the user/workspace
        let blogsQuery = (supabase
            .from('blogs') as any)
            .select('*')
            .not('blog_html', 'is', null)
            .not('blog_html', 'eq', '')
            .order('created_at', { ascending: false });

        if (workspaceId) {
            blogsQuery = blogsQuery.eq('workspace_id', workspaceId);
        } else {
            blogsQuery = blogsQuery.eq('user_id', user.id);
        }

        const { data: allBlogs, error: blogsError } = await blogsQuery;

        if (blogsError || !allBlogs) {
            return NextResponse.json({ error: 'Failed to load blogs' }, { status: 500 });
        }

        // 2. Perform analysis for each blog
        // Process in batches of 5 to avoid timeouts in some environments
        const libraryIndex = buildLibraryIndex(allBlogs);
        let totalSuggestions = 0;

        // We'll process this relatively fast if there aren't too many blogs
        // For V1 we do it inline, but return progress if we implement job polling
        for (const blog of allBlogs) {
            // Skip if suggestions already exist and no force refresh
            if (!forceRefresh) {
                const { count } = await (supabase
                    .from('internal_link_suggestions') as any)
                    .select('*', { count: 'exact', head: true })
                    .eq('source_blog_id', blog.id)
                    .eq('status', 'pending');

                if (count && count > 0) continue;
            }

            // Compute suggestions for this blog
            const sourceIndex = buildIndexEntry(blog);

            // Fetch existing outbound links for this specific blog
            const { data: existingLinks } = await (supabase
                .from('applied_internal_links') as any)
                .select('target_blog_id')
                .eq('source_blog_id', blog.id)
                .eq('is_active', true);

            sourceIndex.existingOutboundLinks = (existingLinks || []).map((l: any) => l.target_blog_id);

            const suggestions = computeLinkSuggestions(
                { ...sourceIndex, html: blog.blog_html },
                libraryIndex,
                baseUrl || '',
                { maxSuggestions: 5 }
            );

            if (suggestions.length > 0) {
                // Delete old
                await (supabase
                    .from('internal_link_suggestions') as any)
                    .delete()
                    .eq('source_blog_id', blog.id)
                    .eq('status', 'pending');

                // Insert new
                const suggestionsToInsert = suggestions.map(s => ({
                    user_id: user.id,
                    workspace_id: workspaceId || (blog as any).workspace_id,
                    source_blog_id: (blog as any).id,
                    target_blog_id: s.targetBlogId,
                    target_title: s.targetTitle,
                    target_slug: s.targetSlug,
                    target_url: s.targetUrl,
                    target_focus_keyword: s.targetFocusKeyword,
                    anchor_text: s.anchorText,
                    context_sentence: s.contextSentence,
                    section_h2: s.sectionH2,
                    placement_type: s.placementType,
                    relevance_score: s.relevanceScore,
                    score_breakdown: s.scoreBreakdown,
                    status: 'pending',
                }));

                await (supabase
                    .from('internal_link_suggestions') as any)
                    .insert(suggestionsToInsert);

                totalSuggestions += suggestions.length;
            }
        }

        // 3. Fetch orphans for final summary
        const { data: orphans } = await (supabase as any).rpc('get_orphan_blogs', {
            p_user_id: user.id,
            p_workspace_id: workspaceId || null,
        });

        return NextResponse.json({
            analysed: allBlogs.length,
            totalSuggestions,
            orphanBlogs: (orphans || []).length,
            status: 'completed'
        });

    } catch (error: any) {
        console.error('Library Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
