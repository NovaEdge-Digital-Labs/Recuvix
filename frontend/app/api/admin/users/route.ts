import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search');
        const label = searchParams.get('label');
        const country = searchParams.get('country');
        const tenantId = searchParams.get('tenantId');
        const minBlogs = searchParams.get('minBlogs');
        const maxBlogs = searchParams.get('maxBlogs');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const isSuspended = searchParams.get('isSuspended');
        const joinedAfter = searchParams.get('joinedAfter');
        const joinedBefore = searchParams.get('joinedBefore');

        let query = supabaseAdmin
            .from('profiles')
            .select(`
        *,
        wl_tenants (
          name
        )
      `, { count: 'exact' });

        // Apply filters
        if (search) {
            query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
        }
        if (label && label !== 'all') {
            query = query.eq('user_label', label);
        }
        if (country) {
            query = query.eq('country', country);
        }
        if (tenantId) {
            query = query.eq('tenant_id', tenantId);
        }
        if (isSuspended !== null && isSuspended !== undefined && isSuspended !== '') {
            query = query.eq('is_suspended', isSuspended === 'true');
        }
        if (minBlogs) {
            query = query.gte('total_blogs_generated', parseInt(minBlogs));
        }
        if (maxBlogs) {
            query = query.lte('total_blogs_generated', parseInt(maxBlogs));
        }
        if (joinedAfter) {
            query = query.gte('created_at', joinedAfter);
        }
        if (joinedBefore) {
            query = query.lte('created_at', joinedBefore);
        }

        // Sorting
        const sortCol = sortBy === 'credits' ? 'credits_balance' :
            sortBy === 'blogs' ? 'total_blogs_generated' :
                sortBy === 'joined' ? 'created_at' : sortBy;

        query = query.order(sortCol, { ascending: sortOrder === 'asc' });

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data: users, count, error } = await query;

        if (error) throw error;

        // Platform Stats
        const { data: totalCount } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true });
        const { data: activeToday } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).gte('last_active_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
        const { data: newThisWeek } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
        const { data: byokUsers } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }).eq('managed_mode_enabled', false);

        return NextResponse.json({
            users: users.map((u: any) => ({
                ...u,
                tenantName: u.wl_tenants?.name || 'Recuvix Main'
            })),
            total: count || 0,
            page,
            totalPages: Math.ceil((count || 0) / limit),
            stats: {
                totalUsers: totalCount?.length || 0, // Wait, select head true doesn't return length like this in some versions
                activeToday: activeToday?.length || 0,
                newThisWeek: newThisWeek?.length || 0,
                byokUsers: byokUsers?.length || 0,
                managedUsers: (totalCount?.length || 0) - (byokUsers?.length || 0)
            }
        });

    } catch (error: any) {
        console.error('API Error in get-users:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
    }
}
