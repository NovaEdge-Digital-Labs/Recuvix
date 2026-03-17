import { NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;
        const { data, error } = await db
            .from('platform_key_usage_log')
            .select('*')
            .order('started_at', { ascending: false })
            .limit(100);

        if (error) throw error;

        return NextResponse.json({ success: true, logs: data || [] });
    } catch (error: any) {
        console.error('API Error in GET usage logs:', error);
        return NextResponse.json({ error: error.message || 'Failed to get usage logs' }, { status: 500 });
    }
}
