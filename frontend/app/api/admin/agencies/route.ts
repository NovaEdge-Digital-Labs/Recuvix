import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        // 1. Fetch agencies with basic stats
        const { data: agencies, error } = await supabaseAdmin
            .from('wl_tenants')
            .select(`
        *,
        owner:profiles!owner_user_id (email)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. Fetch user counts per tenant
        const { data: userCounts } = await supabaseAdmin
            .from('profiles')
            .select('tenant_id', { count: 'exact', head: false });

        const tenantUserMap: Record<string, number> = {};
        userCounts?.forEach((u: any) => {
            if (u.tenant_id) {
                tenantUserMap[u.tenant_id] = (tenantUserMap[u.tenant_id] || 0) + 1;
            }
        });

        // 3. Fetch revenue stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: revenueData } = await supabaseAdmin
            .from('wl_revenue_transactions')
            .select('tenant_id, gross_amount_inr, tenant_share_inr, payout_status')
            .gte('created_at', startOfMonth.toISOString());

        const tenantRevenueMap: Record<string, number> = {};
        revenueData?.forEach((r: any) => {
            tenantRevenueMap[r.tenant_id] = (tenantRevenueMap[r.tenant_id] || 0) + r.gross_amount_inr;
        });

        // 4. Calculate overall stats
        let totalMRR = 0;
        let activeAgencies = 0;
        let trialAgencies = 0;
        let pendingPayouts = 0;

        const formattedAgencies = agencies.map((a: any) => {
            totalMRR += (a.monthly_licence_fee_inr || 0) / 100;
            if (a.licence_status === 'active') activeAgencies++;
            if (a.licence_status === 'trial') trialAgencies++;

            return {
                id: a.id,
                name: a.name,
                slug: a.slug,
                subdomain: a.subdomain,
                customDomain: a.custom_domain,
                ownerEmail: a.owner?.email,
                licencePlan: a.licence_plan,
                licenceStatus: a.licence_status,
                monthlyFeeInr: (a.monthly_licence_fee_inr || 0) / 100,
                revenueSharePercent: a.revenue_share_percent,
                totalUsers: tenantUserMap[a.id] || 0,
                revenueThisMonth: (tenantRevenueMap[a.id] || 0) / 100,
                createdAt: a.created_at,
                lastActiveAt: a.last_active_at,
            };
        });

        // Pending payouts total
        const { data: pendingData } = await supabaseAdmin
            .from('wl_revenue_transactions')
            .select('tenant_share_inr')
            .eq('payout_status', 'pending');

        pendingPayouts = (pendingData?.reduce((acc: number, val: any) => acc + val.tenant_share_inr, 0) || 0) / 100;

        return NextResponse.json({
            agencies: formattedAgencies,
            total: agencies.length,
            stats: {
                totalAgencies: agencies.length,
                activeAgencies,
                trialAgencies,
                totalMRR,
                totalRevenueThisMonth: (revenueData?.reduce((acc: number, val: any) => acc + val.gross_amount_inr, 0) || 0) / 100,
                pendingPayouts
            }
        });

    } catch (error: any) {
        console.error('API Error in get-agencies:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch agencies' }, { status: 500 });
    }
}
