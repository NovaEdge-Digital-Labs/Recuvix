"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { WorkspaceSettingsForm } from '@/components/workspaces/WorkspaceSettingsForm';

export default function WorkspaceSettingsPage() {
    const { activeWorkspace } = useWorkspace();

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
                <p className="text-muted-foreground">
                    Manage metadata, ownership, and critical operations for <span className="font-medium text-foreground">{activeWorkspace.name}</span>.
                </p>
            </header>

            <div className="max-w-4xl">
                <WorkspaceSettingsForm />
            </div>
        </div>
    );
}
