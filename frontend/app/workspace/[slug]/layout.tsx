import React, { useState, useEffect } from 'react';
import { WorkspaceSidebar } from '@/components/workspaces/WorkspaceSidebar';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useAuth } from '@/context/AuthContext';
import { redirect, useParams, useSearchParams } from 'next/navigation';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { activeWorkspace, isLoading: isWorkspaceLoading } = useWorkspace();
    const { profile, refreshProfile, isLoading: isAuthLoading } = useAuth();
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;

    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && profile) {
            const forceOnboarding = searchParams.get('onboarding') === 'true';
            const localOnboarded = localStorage.getItem('recuvix_onboarded') === 'true';

            if ((!profile.onboarding_completed && !localOnboarded) || forceOnboarding) {
                setIsOnboardingOpen(true);
            }
        }
    }, [profile, isAuthLoading, searchParams]);

    const handleOnboardingComplete = async () => {
        setIsOnboardingOpen(false);
        await refreshProfile();
    };

    // Wait for hydration/loading
    if (isWorkspaceLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Security: Ensure the user is actually in this workspace context
    if (!activeWorkspace || activeWorkspace.slug !== slug) {
        redirect('/workspaces');
    }

    return (
        <div className="flex min-h-screen bg-background">
            <WorkspaceSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <OnboardingModal
                isOpen={isOnboardingOpen}
                onComplete={handleOnboardingComplete}
            />
        </div>
    );
}
