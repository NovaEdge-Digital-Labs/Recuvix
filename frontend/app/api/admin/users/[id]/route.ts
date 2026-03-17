import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { updateUserAdminSchema } from '@/lib/validators/adminCreditsSchemas';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;
        const body = await req.json();
        const validated = updateUserAdminSchema.parse(body);

        const updates: any = {};
        if (validated.adminNote !== undefined) updates.admin_note = validated.adminNote;
        if (validated.userLabel !== undefined) updates.user_label = validated.userLabel === 'none' ? null : validated.userLabel;
        if (validated.isSuspended !== undefined) updates.is_suspended = validated.isSuspended;
        if (validated.suspendedReason !== undefined) updates.suspended_reason = validated.suspendedReason;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabaseAdmin as any;
        const { data, error } = await db
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, user: data });

    } catch (error: any) {
        console.error('API Error in update-user:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
    }
}
