import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const userId = params.id;

        // Fetch direct referrals
        const { data: referrals, error } = await (supabaseAdmin
            .from('referrals') as any)
            .select(`
                *,
                referred_profile:profiles!referred_user_id (
                    id,
                    email,
                    full_name,
                    created_at,
                    total_blogs_generated
                )
            `)
            .eq('referrer_user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            referrals: referrals.map((r: any) => ({
                id: r.id,
                status: r.status,
                created_at: r.created_at,
                converted_at: r.converted_at,
                rewarded_at: r.rewarded_at,
                user: r.referred_profile
            }))
        });

    } catch (error: any) {
        console.error('API Error in referral-tree:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch referral tree' }, { status: 500 });
    }
}
