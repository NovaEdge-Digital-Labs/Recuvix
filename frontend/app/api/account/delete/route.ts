import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: Supabase Admin SDK must be used to delete a user. This uses the admin client.
    // This is a server route so it's safe to import admin here.
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const admin = createAdminClient();

    // Delete user data first (RLS ensures only their data is affected)
    // Blogs, API keys, etc. are cascade deleted by Supabase foreign key constraints
    const { error } = await admin.auth.admin.deleteUser(user.id);

    if (error) {
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
