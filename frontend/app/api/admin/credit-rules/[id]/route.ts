import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { creditRuleSchema } from '@/lib/validators/adminCreditsSchemas';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;
        const body = await req.json();
        const validated = creditRuleSchema.partial().parse(body);

        const { data: rule, error } = await (supabaseAdmin
            .from('credit_rules')
            .update(validated as any) as any)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, rule });
    } catch (error: any) {
        console.error('API Error in update-rule:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to update credit rule' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { id } = await params;

        const { error } = await supabaseAdmin
            .from('credit_rules')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('API Error in delete-rule:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete credit rule' }, { status: 500 });
    }
}
