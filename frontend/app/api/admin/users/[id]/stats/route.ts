import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;

        const [statsResult, historyResult] = await Promise.all([
            db.rpc('get_user_admin_stats', { p_user_id: id }),
            db.from('credit_transactions')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false })
                .limit(5)
        ]);

        if (statsResult.error) throw statsResult.error;
        if (historyResult.error) throw historyResult.error;

        return NextResponse.json({
            success: true,
            stats: statsResult.data,
            creditHistory: historyResult.data
        });
    } catch (error: any) {
        console.error('API Error fetching user stats:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch user stats' }, { status: 500 });
    }
}
