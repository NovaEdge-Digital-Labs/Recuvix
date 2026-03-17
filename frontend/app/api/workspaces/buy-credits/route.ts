import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspacesService } from '@/lib/db/workspacesService';

const buySchema = z.object({
    workspaceId: z.string().uuid(),
    packId: z.string(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { workspaceId, packId } = buySchema.parse(body);

        // 1. Verify requester is owner
        const workspace = await workspacesService.getById(workspaceId, supabase);
        if (!workspace || workspace.owner_id !== user.id) {
            return NextResponse.json({ error: 'Only the workspace owner can buy credits' }, { status: 403 });
        }

        // 2. Create Razorpay order (Mirroring credits/create-order)
        // NOTE: In a real implementation, we would call the Razorpay service here.
        // Since I don't see the Razorpay service implementation in the context yet, 
        // I'll assume it exists or use a mock flow for now as per instructions.

        // For now, returning a success with a mock order ID
        const orderId = `order_ws_${Math.random().toString(36).substring(7)}`;

        return NextResponse.json({
            success: true,
            orderId,
            workspaceId,
            packId,
            amount: 1000 // Mock amount
        });
    } catch (error: any) {
        console.error('Buy workspace credits failed:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
