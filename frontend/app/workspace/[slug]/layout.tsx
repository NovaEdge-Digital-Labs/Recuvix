import { WorkspaceSidebar } from '@/components/workspaces/WorkspaceSidebar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WorkspaceClientWrapper } from './WorkspaceClientWrapper';

export default async function WorkspaceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) redirect('/login');

    // Security: Ensure the user is actually in this workspace context
    const { data: workspace } = await supabase
        .from('workspaces')
        .select(`
             id,
             slug,
             workspace_members!inner(user_id)
        `)
        .eq('slug', slug)
        .eq('workspace_members.user_id', user.id)
        .single();

    if (!workspace) redirect('/workspaces');

    return (
        <div className="flex min-h-screen bg-background">
            <WorkspaceSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <WorkspaceClientWrapper initialProfile={profile} />
        </div>
    );
}
