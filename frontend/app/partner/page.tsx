'use client';

import React from 'react';
import { PartnerDashboard } from '@/components/wl/PartnerDashboard';
import { useTenant } from '@/context/TenantContext';
import { redirect } from 'next/navigation';

export default function PartnerPage() {
    const { isTenantMode, isAdmin, isLoading } = useTenant();

    // While loading tenant context, show nothing or a loader
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
            </div>
        );
    }

    // RBAC: If not in tenant mode, or if not an admin/owner
    if (!isTenantMode || !isAdmin) {
        redirect('/');
    }

    return (
        <div className="container max-w-7xl mx-auto py-10 px-4 md:px-8">
            <PartnerDashboard />
        </div>
    );
}
