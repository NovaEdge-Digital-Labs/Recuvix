"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { WorkspaceCreditsPanel } from '@/components/workspaces/WorkspaceCreditsPanel';
import { Button } from '@/components/ui/button';
import { Zap, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WorkspaceCreditsPage() {
    const { activeWorkspace } = useWorkspace();

    if (!activeWorkspace) return null;

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Credits Management</h1>
                    <p className="text-muted-foreground">
                        Manage the shared credit pool for <span className="font-medium text-foreground">{activeWorkspace.name}</span>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/pricing">
                        <Button className="gap-2">
                            <Plus className="size-4" />
                            Buy Credits
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="max-w-5xl">
                <WorkspaceCreditsPanel />
            </div>
        </div>
    );
}
