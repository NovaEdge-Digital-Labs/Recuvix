'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import Link from 'next/link';
import Image from 'next/image';

export function TenantNavLogo() {
    const { isTenantMode, tenantName, tenantLogo } = useTenant();

    // Tenant mode with logo
    if (isTenantMode && tenantLogo) {
        return (
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-8 w-auto">
                    <img
                        src={tenantLogo}
                        alt={tenantName}
                        className="h-8 w-auto object-contain"
                    />
                </div>
            </Link>
        );
    }

    // Tenant mode without logo (fallback to text)
    if (isTenantMode) {
        return (
            <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold font-syne text-accent">
                    {tenantName}
                </span>
            </Link>
        );
    }

    // Main Recuvix logo
    return (
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm rotate-45" />
            </div>
            <span className="text-xl font-bold font-syne tracking-tight text-text-primary">
                Recuvix
            </span>
        </Link>
    );
}
