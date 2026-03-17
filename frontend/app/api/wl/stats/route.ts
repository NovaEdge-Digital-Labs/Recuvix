import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    try {
        const tenantHeader = req.headers.get('x-recuvix-tenant');
        const tenant = tenantHeader ? JSON.parse(tenantHeader) : null;
        const tenantId = tenant?.id;

        if (!tenantId) {
            return NextResponse.json({ error: 'Tenant context missing' }, { status: 400 });
        }

        // 1. Fetch Revenue Stats
        const { data: revenueData, error: revError } = await (supabaseAdmin
            .from('wl_revenue_transactions' as any)
            .select('amount_total, amount_tenant_net')
            .eq('tenant_id', tenantId) as any);

        if (revError) throw revError;

        const totalRevenue = (revenueData || []).reduce((sum: number, tx: any) => sum + (tx.amount_total || 0), 0);
        const partnerShare = (revenueData || []).reduce((sum: number, tx: any) => sum + (tx.amount_tenant_net || 0), 0);

        // 2. Fetch Blog Count
        const { count: blogCount, error: blogError } = await (supabaseAdmin
            .from('blogs' as any)
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId) as any);

        if (blogError) throw blogError;

        // 3. Fetch User Count
        const { count: userCount, error: userError } = await (supabaseAdmin
            .from('profiles' as any)
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId) as any);

        if (userError) throw userError;

        // 4. Fetch Workspace Count
        const { count: workspaceCount, error: wsError } = await (supabaseAdmin
            .from('workspaces' as any)
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId) as any);

        if (wsError) throw wsError;

        // 5. Recent Transactions
        const { data: recentTransactions, error: txError } = await (supabaseAdmin
            .from('wl_revenue_transactions' as any)
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false })
            .limit(5) as any);

        if (txError) throw txError;

        return NextResponse.json({
            stats: {
                totalRevenue,
                partnerShare,
                blogCount: blogCount || 0,
                userCount: userCount || 0,
                workspaceCount: workspaceCount || 0,
            },
            recentTransactions: recentTransactions || []
        });

    } catch (error: any) {
        console.error('WL Stats API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
