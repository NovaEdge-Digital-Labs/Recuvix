"use client";

import React from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import {
    Users,
    Zap,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function WorkspaceBanner() {
    const { activeWorkspace, activeRole } = useWorkspace();

    if (!activeWorkspace) return null;

    return (
        <div className="mb-8 p-4 rounded-xl border bg-gradient-to-r from-primary/5 via-background to-background flex flex-col md:flex-row md:items-center justify-between gap-4 border-primary/20">
            <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/10">
                    {activeWorkspace.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        Collaborating on {activeWorkspace.name}
                        <Badge variant="outline" className="text-[10px] py-0 h-4 capitalize font-medium">{activeRole}</Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Using shared credits and brand assets.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Team Pool</p>
                    <div className="flex items-center gap-1.5 font-bold">
                        <Zap className="size-3 text-primary" />
                        {activeWorkspace.credits_balance} Credits
                    </div>
                </div>
                <Link href={`/workspace/${activeWorkspace.slug}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs gap-1.5 hover:bg-primary/5 hover:text-primary transition-colors">
                        Workspace Dashboard
                        <ArrowRight className="size-3" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
