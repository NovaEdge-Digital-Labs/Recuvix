"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    XCircle,
    MessageSquare,
    Loader2,
    Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '@/context/WorkspaceContext';

interface ApprovalActionsProps {
    blogId: string;
    status: string;
    onStatusChange?: (newStatus: string) => void;
}

export function ApprovalActions({ blogId, status, onStatusChange }: ApprovalActionsProps) {
    const { can, activeRole } = useWorkspace();
    const [isLoading, setIsLoading] = useState(false);

    if (!can('approve_blogs')) {
        return (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                <Shield className="size-3" />
                Only Admins can approve blogs
            </div>
        );
    }

    const handleAction = async (newStatus: 'approved' | 'rejected') => {
        setIsLoading(true);
        try {
            // This would be an API call to update the blog status
            // For now, we simulate it
            await new Promise(resolve => setTimeout(resolve, 800));

            toast.success(`Blog ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
            onStatusChange?.(newStatus);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'approved') return null;

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleAction('rejected')}
                disabled={isLoading}
            >
                <XCircle className="mr-2 size-4" />
                Reject
            </Button>
            <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAction('approved')}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                    <CheckCircle2 className="mr-2 size-4" />
                )}
                Approve & Publish
            </Button>
        </div>
    );
}
