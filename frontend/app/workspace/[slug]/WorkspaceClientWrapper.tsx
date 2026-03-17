'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';

export function WorkspaceClientWrapper({ initialProfile }: { initialProfile: any }) {
    const { refreshProfile } = useAuth();
    const searchParams = useSearchParams();
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    useEffect(() => {
        const forceOnboarding = searchParams.get('onboarding') === 'true';
        const localOnboarded = localStorage.getItem('recuvix_onboarded') === 'true';

        if ((!initialProfile.onboarding_completed && !localOnboarded) || forceOnboarding) {
            setIsOnboardingOpen(true);
        }
    }, [initialProfile, searchParams]);

    const handleOnboardingComplete = async () => {
        setIsOnboardingOpen(false);
        await refreshProfile();
    };

    return (
        <OnboardingModal
            isOpen={isOnboardingOpen}
            onComplete={handleOnboardingComplete}
        />
    );
}
