import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const createTenantSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    ownerEmail: z.string().email(),
    customDomain: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Platform Admin Secret Key
        const authHeader = req.headers.get('Authorization');
        const adminSecret = process.env.ADMIN_SECRET_KEY;

        if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validated = createTenantSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json({ error: 'Invalid data', details: validated.error }, { status: 400 });
        }

        const { name, slug, ownerEmail, customDomain } = validated.data;

        // 2. Find or invite the owner user
        let ownerId: string | null = null;

        // Try to find existing user
        const { data: userData } = await (supabaseAdmin
            .from('profiles') as any)
            .select('id')
            .eq('email', ownerEmail)
            .single();

        if (userData) {
            ownerId = (userData as any).id;
        } else {
            // In a real app, invite the user via Auth API
            // For now, we assume the user must already exist in Recuvix
            return NextResponse.json({ error: 'Owner user not found in Recuvix. Please ask them to sign up first.' }, { status: 400 });
        }

        // 3. Create the Tenant
        const { data: tenant, error: tenantError } = await (supabaseAdmin
            .from('wl_tenants') as any)
            .insert({
                name,
                slug,
                custom_domain: customDomain,
                owner_id: ownerId,
                status: 'pending',
                colors: {
                    accent: '#3b82f6',
                    background: '#ffffff',
                    foreground: '#0f172a',
                    card: '#ffffff',
                    border: '#e2e8f0'
                },
                fonts: {
                    heading: 'Inter',
                    body: 'Inter'
                },
                features: {
                    custom_domain: !!customDomain,
                    byok_mode: true,
                    multilingual: true,
                    voice_studio: true,
                    bulk_generation: true,
                    keyword_research: true,
                    content_calendar: true,
                    tracker: true,
                    competitor_analyzer: true,
                    repurpose: true,
                    internal_linking: true
                }
            })
            .select()
            .single();

        if (tenantError) {
            console.error('Tenant Creation Error:', tenantError);
            return NextResponse.json({ error: 'Failed to create tenant', details: tenantError }, { status: 500 });
        }

        // 4. Link User to Tenant as Admin
        const { error: linkError } = await (supabaseAdmin
            .from('wl_tenant_users') as any)
            .insert({
                tenant_id: (tenant as any).id,
                user_id: ownerId,
                role: 'admin',
                status: 'active'
            });

        if (linkError) {
            console.error('User-Tenant Link Error:', linkError);
            return NextResponse.json({ error: 'Tenant created but failed to link owner', tenantId: (tenant as any).id }, { status: 500 });
        }

        return NextResponse.json({ success: true, tenant });

    } catch (error: any) {
        console.error('Admin Tenant API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
