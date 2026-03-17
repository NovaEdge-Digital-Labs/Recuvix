import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/utils/adminAuth';
import { adminCreditsService } from '@/lib/db/adminCreditsService';

export async function GET(req: NextRequest) {
    try {
        const isAdmin = await checkAdminAuth();
        if (!isAdmin) return unauthorizedResponse();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const { data, total } = await adminCreditsService.getHistory(limit, offset);

        return NextResponse.json({
            success: true,
            data,
            total
        });

    } catch (error: any) {
        console.error('API Error in credits-history:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch credit history' }, { status: 500 });
    }
}
