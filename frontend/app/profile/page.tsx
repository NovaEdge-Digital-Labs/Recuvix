'use client';

import { useState, useEffect } from 'react';
import { NavBar } from '@/components/navigation/NavBar';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ReferralSection } from '@/components/profile/ReferralSection';
import { ApiKeysSection } from '@/components/profile/ApiKeysSection';
import { StatsSection } from '@/components/profile/StatsSection';
import { DangerZone } from '@/components/profile/DangerZone';
import { CreditsSection } from '@/components/credits/CreditsSection';
import { MigrationModal } from '@/components/auth/MigrationModal';
import { detectLocalData } from '@/lib/migration/localStorageMigrator';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user } = useAuth();
    const [showMigration, setShowMigration] = useState(false);

    useEffect(() => {
        // Show migration modal if local data exists and user is logged in
        if (user) {
            const local = detectLocalData();
            const hasData = local.blogCount > 0 || local.hasApiKeys || local.wpConnectionCount > 0 || local.researchCount > 0;
            if (hasData) setShowMigration(true);
        }
    }, [user]);

    return (
        <>
            <NavBar />
            <main className="min-h-screen bg-background">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your profile, API keys, and account preferences</p>
                    </div>

                    <ProfileSection />
                    <ReferralSection />
                    <CreditsSection />
                    <StatsSection />
                    <ApiKeysSection />
                    <DangerZone />
                </div>
            </main>

            {showMigration && (
                <MigrationModal onDismiss={() => setShowMigration(false)} />
            )}
        </>
    );
}
