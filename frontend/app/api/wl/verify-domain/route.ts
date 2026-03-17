import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);

export async function POST(req: NextRequest) {
    try {
        const { tenantId, domain } = await req.json();

        if (!tenantId || !domain) {
            return NextResponse.json({ error: 'Missing tenantId or domain' }, { status: 400 });
        }

        // 1. Get the verification record
        const { data: verification, error: fetchError } = await (supabaseAdmin
            .from('wl_domain_verifications' as any)
            .select('*')
            .eq('tenant_id', tenantId)
            .eq('domain', domain)
            .single()) as any;

        if (fetchError || !verification) {
            return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
        }

        // 2. Perform DNS Lookup
        let isVerified = false;
        try {
            const records = await resolveTxt(domain);
            const expectedValue = verification.txt_record as string;

            // Check if any TXT record matches
            isVerified = records.some(record => record.includes(expectedValue));
        } catch (dnsError: any) {
            console.error('DNS Lookup Error:', dnsError);
            // ENODATA or ENOTFOUND is expected if record doesn't exist yet
        }

        // 3. Update Verification Status
        const status = isVerified ? 'verified' : 'failed';
        const { error: updateError } = await (supabaseAdmin
            .from('wl_domain_verifications' as any) as any)
            .update({
                status,
                last_checked_at: new Date().toISOString()
            })
            .eq('id', verification?.id);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
        }

        // 4. If verified, update the tenant record
        if (isVerified) {
            await (supabaseAdmin
                .from('wl_tenants' as any) as any)
                .update({ domain_verified: true })
                .eq('id', tenantId);
        }

        return NextResponse.json({
            success: true,
            status,
            message: isVerified ? 'Domain verified successfully' : 'Verification record not found in DNS'
        });

    } catch (error: any) {
        console.error('Verify Domain API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
