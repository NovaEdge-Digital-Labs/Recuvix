'use client';

import React from 'react';
import { PartnerSettings } from '@/components/wl/PartnerSettings';
import { DomainSettings } from '@/components/wl/DomainSettings';
import { useTenant } from '@/context/TenantContext';
import { redirect } from 'next/navigation';

export default function PartnerSettingsPage() {
    const { isTenantMode, isAdmin, isLoading } = useTenant();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
            </div>
        );
    }

    if (!isTenantMode || !isAdmin) {
        redirect('/');
    }

    return (
        <div className="container max-w-5xl mx-auto py-10 space-y-10">
            <PartnerSettings />
            <DomainSettings />
        </div>
    );
}
