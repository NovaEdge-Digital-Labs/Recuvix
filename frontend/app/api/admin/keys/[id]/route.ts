import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;
        const body = await req.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;

        const { error } = await db
            .from('platform_api_keys')
            .update(body)
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error in PATCH admin key:', error);
        return NextResponse.json({ error: error.message || 'Failed to update key' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;

        const { error } = await db
            .from('platform_api_keys')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error in DELETE admin key:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete key' }, { status: 500 });
    }
}
