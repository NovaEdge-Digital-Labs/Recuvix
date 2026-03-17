"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { BrandAssetsPanel } from '@/components/workspaces/BrandAssetsPanel';

export default function WorkspaceBrandPage() {
    const { activeWorkspace } = useWorkspace();

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Brand Assets</h1>
                <p className="text-muted-foreground">
                    Define your team's visual identity and content strategy defaults for <span className="font-medium text-foreground">{activeWorkspace.name}</span>.
                </p>
            </header>

            <div className="max-w-4xl">
                <BrandAssetsPanel />
            </div>
        </div>
    );
}
