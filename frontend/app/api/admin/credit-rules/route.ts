import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { creditRuleSchema } from '@/lib/validators/adminCreditsSchemas';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { data: rules, error } = await supabaseAdmin
            .from('credit_rules')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ rules });
    } catch (error: any) {
        console.error('API Error in get-rules:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch credit rules' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const body = await req.json();
        const validated = creditRuleSchema.parse(body);

        const { data: rule, error } = await supabaseAdmin
            .from('credit_rules')
            .insert(validated)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, rule });
    } catch (error: any) {
        console.error('API Error in create-rule:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Failed to create credit rule' }, { status: 500 });
    }
}
