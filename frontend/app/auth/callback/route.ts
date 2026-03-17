import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createServerSupabaseClient();
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && session?.user) {
            const user = session.user;
            const typedSupabase = supabase as any;

            // 1. Get User Profile for onboarding check and tenant assignment
            const { data: profile } = await typedSupabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            // 2. Check if user is joininig via a tenant
            const headersList = await headers();
            const tenantHeader = headersList.get('x-recuvix-tenant');
            const tenantIdFromQuery = searchParams.get('tenant_id');
            const tenantId = tenantIdFromQuery || (tenantHeader ? JSON.parse(tenantHeader)?.id : null);

            if (tenantId) {
                // Assign user to tenant
                await typedSupabase
                    .from('profiles')
                    .update({ active_workspace_id: tenantId })
                    .eq('id', user.id);

                await typedSupabase
                    .from('wl_tenant_users')
                    .upsert({
                        tenant_id: tenantId,
                        user_id: user.id,
                        role: 'user',
                        status: 'active'
                    }, { onConflict: 'tenant_id,user_id' });
            }

            // 3. Referral Logic (only for new signups)
            const refCode = searchParams.get('ref');
            if (refCode && profile && !profile.referred_by_user_id) {
                const { data: referrer } = await typedSupabase
                    .from('profiles')
                    .select('id')
                    .eq('referral_code', refCode)
                    .single();

                if (referrer) {
                    await typedSupabase
                        .from('profiles')
                        .update({ referred_by_user_id: referrer.id })
                        .eq('id', user.id);

                    await typedSupabase
                        .from('referrals')
                        .insert({
                            referrer_user_id: referrer.id,
                            referred_user_id: user.id,
                            referral_code: refCode,
                            status: 'signed_up',
                            signed_up_at: new Date().toISOString()
                        });

                    await typedSupabase.rpc('increment_total_referrals', { p_user_id: referrer.id });

                    await typedSupabase
                        .from('notifications')
                        .insert({
                            user_id: referrer.id,
                            title: 'New Referral! 🤝',
                            message: `Someone just signed up using your link!`,
                            type: 'info',
                            link: '/profile#refer'
                        });
                }
            }

            // 4. Signup Bonus Credits Evaluation
            await typedSupabase.rpc('evaluate_credit_rules', {
                p_user_id: user.id,
                p_trigger_event: 'signup',
                p_metadata: { source: 'auth_callback', is_oauth: !!session.provider_token }
            });

            // 5. Determine Redirect
            // If it's a password recovery, go to next (likely settings/profile)
            if (searchParams.get('type') === 'recovery') {
                return NextResponse.redirect(`${origin}${next}`);
            }

            // If onboarding not completed, go to /, modal will trigger
            if (profile && !profile.onboarding_completed) {
                return NextResponse.redirect(`${origin}/?onboarding=true`);
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Auth failed
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

