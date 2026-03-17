import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;
        const { data, error } = await db
            .from('platform_settings')
            .select('*');

        if (error) throw error;

        return NextResponse.json({ success: true, settings: data });
    } catch (error: any) {
        console.error('API Error in GET settings:', error);
        return NextResponse.json({ error: error.message || 'Failed to get settings' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const body = await req.json();
        const { settings } = body; // Array of setting objects { key, value }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;

        for (const setting of settings) {
            const { error } = await db
                .from('platform_settings')
                .update({ value: setting.value, updated_at: new Date().toISOString() })
                .eq('key', setting.key);

            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error in POST settings:', error);
        return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
    }
}
