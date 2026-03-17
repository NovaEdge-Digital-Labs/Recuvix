'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';

export function PoweredByBadge() {
    const { isTenantMode } = useTenant();

    // Only show in tenant mode if we want to (could add a setting for this)
    if (!isTenantMode) return null;

    return (
        <div className="flex items-center justify-center py-4 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Powered by <span className="text-foreground font-bold">Recuvix</span>
            </p>
        </div>
    );
}
