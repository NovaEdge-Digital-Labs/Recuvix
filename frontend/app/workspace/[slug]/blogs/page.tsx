"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { HistoryPage } from '@/components/history/HistoryPage';

export default function WorkspaceBlogsPage() {
    const { activeWorkspace } = useWorkspace();

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-8">
            <HistoryPage workspaceId={activeWorkspace.id} />
        </div>
    );
}
