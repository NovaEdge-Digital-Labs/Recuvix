import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { encryptKey, maskKey } from '@/lib/managed/keyEncryption';

export async function GET() {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;
        const { data, error } = await db
            .from('platform_api_keys')
            .select('*')
            .order('priority', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, keys: data });
    } catch (error: any) {
        console.error('API Error in GET admin keys:', error);
        return NextResponse.json({ error: error.message || 'Failed to get keys' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const body = await req.json();
        const { provider, model, label, apiKey, priority, dailyLimit } = body;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;

        const { error } = await db
            .from('platform_api_keys')
            .insert({
                provider,
                model,
                label,
                encrypted_key: encryptKey(apiKey),
                key_hint: maskKey(apiKey),
                priority,
                daily_request_limit: dailyLimit,
                is_active: true,
                is_healthy: true,
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error in POST admin key:', error);
        return NextResponse.json({ error: error.message || 'Failed to create key' }, { status: 500 });
    }
}
