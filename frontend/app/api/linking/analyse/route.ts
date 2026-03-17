import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { buildIndexEntry, buildLibraryIndex } from '@/lib/linking/libraryIndexBuilder';
import { computeLinkSuggestions } from '@/lib/linking/linkingEngine';

const AnalyseSchema = z.object({
    blogId: z.string().uuid(),
    baseUrl: z.string().url().optional(),
    workspaceId: z.string().uuid().optional(),
    forceRefresh: z.boolean().optional().default(false),
    minScore: z.number().min(0).max(100).optional().default(35),
    maxSuggestions: z.number().min(1).max(20).optional().default(8),
});

export async function POST(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = AnalyseSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request', details: result.error.format() }, { status: 400 });
        }

        const { blogId, baseUrl, workspaceId, forceRefresh, minScore, maxSuggestions } = result.data;

        // 1. Check if suggestions already exist if not forceRefresh
        if (!forceRefresh) {
            const { data: existingSuggestions } = await (supabase
                .from('internal_link_suggestions') as any)
                .select('*')
                .eq('source_blog_id', blogId)
                .eq('status', 'pending');

            if (existingSuggestions && existingSuggestions.length > 0) {
                return NextResponse.json({
                    blogId,
                    suggestions: existingSuggestions,
                    computedAt: existingSuggestions[0].created_at,
                    cached: true
                });
            }
        }

        // 2. Load the source blog
        const { data: sourceBlog, error: sourceError } = await (supabase
            .from('blogs') as any)
            .select('*')
            .eq('id', blogId)
            .single();

        if (sourceError || !sourceBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // 3. Load the blog library index
        let libraryQuery = (supabase
            .from('blogs') as any)
            .select('id, title, topic, focus_keyword, secondary_keywords, tags, country, slug, word_count, created_at, link_index')
            .neq('id', blogId)
            .not('blog_html', 'is', null)
            .not('blog_html', 'eq', '')
            .order('created_at', { ascending: false })
            .limit(100);

        if (workspaceId) {
            libraryQuery = libraryQuery.eq('workspace_id', workspaceId);
        } else {
            libraryQuery = libraryQuery.eq('user_id', user.id);
        }

        const { data: libraryBlogs, error: libraryError } = await libraryQuery;

        if (libraryError) {
            return NextResponse.json({ error: 'Failed to load library' }, { status: 500 });
        }

        // 4. Load existing outbound links for source blog
        const { data: existingAppliedLinks } = await (supabase
            .from('applied_internal_links') as any)
            .select('target_blog_id')
            .eq('source_blog_id', blogId)
            .eq('is_active', true);

        const existingOutboundIds = (existingAppliedLinks || []).map((l: any) => l.target_blog_id);

        // 5. Build library index
        const libraryIndex = buildLibraryIndex(libraryBlogs || []);

        // 6. Build source blog index entry
        const sourceIndex = buildIndexEntry(sourceBlog);
        sourceIndex.existingOutboundLinks = existingOutboundIds;

        // 7. Compute suggestions
        const suggestions = computeLinkSuggestions(
            { ...sourceIndex, html: sourceBlog.blog_html },
            libraryIndex,
            baseUrl || '',
            { minScore, maxSuggestions }
        );

        // 8. Delete old pending suggestions
        await (supabase
            .from('internal_link_suggestions') as any)
            .delete()
            .eq('source_blog_id', blogId)
            .eq('status', 'pending');

        // 9. Insert new suggestions
        if (suggestions.length > 0) {
            const suggestionsToInsert = suggestions.map(s => ({
                user_id: user.id,
                workspace_id: workspaceId || sourceBlog.workspace_id,
                source_blog_id: blogId,
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

            const { data: inserted, error: insertError } = await (supabase
                .from('internal_link_suggestions') as any)
                .insert(suggestionsToInsert)
                .select();

            if (insertError) {
                console.error('Failed to insert suggestions:', insertError);
            }

            return NextResponse.json({
                blogId,
                suggestions: inserted || [],
                librarySize: libraryBlogs?.length || 0,
                computedAt: new Date().toISOString(),
            });
        }

        return NextResponse.json({
            blogId,
            suggestions: [],
            librarySize: libraryBlogs?.length || 0,
            computedAt: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Linking Analysis Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
