import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

const UpdateSuggestionsSchema = z.object({
    updates: z.array(z.object({
        suggestionId: z.string().uuid(),
        status: z.enum(['approved', 'rejected']),
        rejectedReason: z.string().optional(),
    })),
});

export async function PATCH(req: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = UpdateSuggestionsSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid request', details: result.error.format() }, { status: 400 });
        }

        const { updates } = result.data;

        // Perform updates in batch (or loop if needed for complex logic, 
        // but here simple updates are fine)
        const results = [];
        for (const update of updates) {
            const { data, error } = await (supabase
                .from('internal_link_suggestions') as any)
                .update({
                    status: update.status,
                    rejected_reason: update.rejectedReason,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', update.suggestionId)
                .eq('user_id', user.id) // Ensure ownership
                .select()
                .single();

            if (error) {
                console.error(`Failed to update suggestion ${update.suggestionId}:`, error);
                results.push({ id: update.suggestionId, error: error.message });
            } else {
                results.push(data);
            }
        }

        return NextResponse.json({ updates: results });

    } catch (error: any) {
        console.error('Update Suggestions Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
