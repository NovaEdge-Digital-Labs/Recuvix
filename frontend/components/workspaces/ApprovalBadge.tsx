"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Clock,
    CheckCircle2,
    XCircle,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'draft';

interface ApprovalBadgeProps {
    status: ApprovalStatus;
    className?: string;
}

export function ApprovalBadge({ status, className }: ApprovalBadgeProps) {
    switch (status) {
        case 'approved':
            return (
                <Badge variant="outline" className={cn("gap-1 bg-green-500/10 text-green-600 border-green-500/20", className)}>
                    <CheckCircle2 className="size-3" />
                    Approved
                </Badge>
            );
        case 'rejected':
            return (
                <Badge variant="outline" className={cn("gap-1 bg-red-500/10 text-red-600 border-red-500/20", className)}>
                    <XCircle className="size-3" />
                    Rejected
                </Badge>
            );
        case 'pending':
            return (
                <Badge variant="outline" className={cn("gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse", className)}>
                    <Clock className="size-3" />
                    Pending Approval
                </Badge>
            );
        case 'draft':
            return (
                <Badge variant="outline" className={cn("gap-1 bg-slate-500/10 text-slate-600 border-slate-500/20", className)}>
                    <ShieldCheck className="size-3 opacity-50" />
                    Draft
                </Badge>
            );
        default:
            return null;
    }
}
