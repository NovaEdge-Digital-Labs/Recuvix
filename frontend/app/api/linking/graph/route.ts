import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get('workspaceId');

        // 1. Fetch link graph edges
        const { data: edges, error: edgesError } = await (supabase as any).rpc('get_link_graph', {
            p_user_id: user.id,
            p_workspace_id: workspaceId || null,
        });

        if (edgesError) {
            console.error('Graph Edges Error:', edgesError);
            return NextResponse.json({ error: 'Failed to fetch graph edges' }, { status: 500 });
        }

        // 2. Fetch orphan blogs
        const { data: orphans, error: orphansError } = await (supabase as any).rpc('get_orphan_blogs', {
            p_user_id: user.id,
            p_workspace_id: workspaceId || null,
        });

        if (orphansError) {
            console.error('Orphans Error:', orphansError);
            return NextResponse.json({ error: 'Failed to fetch orphan blogs' }, { status: 500 });
        }

        // 3. Fetch all blogs to build graph nodes
        let blogsQuery = (supabase
            .from('blogs') as any)
            .select('id, title, slug, focus_keyword, internal_links_count')
            .not('blog_html', 'is', null)
            .not('blog_html', 'eq', '');

        if (workspaceId) {
            blogsQuery = blogsQuery.eq('workspace_id', workspaceId);
        } else {
            blogsQuery = blogsQuery.eq('user_id', user.id);
        }

        const { data: allBlogs } = await blogsQuery;

        // 4. Transform into graph structure
        const nodeMap = new Map();
        (allBlogs || []).forEach((b: any) => {
            nodeMap.set(b.id, {
                id: b.id,
                title: b.title,
                slug: b.slug,
                focusKeyword: b.focus_keyword,
                inboundLinks: 0,
                outboundLinks: 0,
                isOrphan: false,
            });
        });

        const graphEdges = (edges || []).map((e: any) => {
            if (nodeMap.has(e.source_id)) {
                nodeMap.get(e.source_id).outboundLinks += e.link_count;
            }
            if (nodeMap.has(e.target_id)) {
                nodeMap.get(e.target_id).inboundLinks += e.link_count;
            }

            return {
                source: e.source_id,
                target: e.target_id,
                sourceTitle: e.source_title,
                targetTitle: e.target_title,
                anchorTexts: e.anchor_texts,
                linkCount: e.link_count,
            };
        });

        // Mark orphans in the node map
        (orphans || []).forEach((o: any) => {
            if (nodeMap.has(o.blog_id)) {
                nodeMap.get(o.blog_id).isOrphan = true;
                nodeMap.get(o.blog_id).inboundLinks = o.inbound_links;
                nodeMap.get(o.blog_id).outboundLinks = o.outbound_links;
            }
        });

        const nodes = Array.from(nodeMap.values());

        return NextResponse.json({
            nodes,
            edges: graphEdges,
            orphans: orphans || [],
            stats: {
                totalLinks: graphEdges.reduce((acc: number, curr: any) => acc + curr.linkCount, 0),
                totalBlogs: nodes.length,
                orphanCount: (orphans || []).length,
                avgLinksPerBlog: nodes.length > 0 ? (graphEdges.length / nodes.length).toFixed(2) : 0,
            }
        });

    } catch (error: any) {
        console.error('Get Graph Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
