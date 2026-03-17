'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Check, X, Loader2, Building2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PendingInvitationCardProps {
    invitation: {
        id: string;
        workspace_id: string;
        role: string;
        created_at: string;
        workspace_name?: string;
    };
    onAction?: () => void;
}

export function PendingInvitationCard({ invitation, onAction }: PendingInvitationCardProps) {
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);

    const handleAction = async (action: 'accept' | 'decline') => {
        if (action === 'accept') setIsAccepting(true);
        else setIsDeclining(true);

        try {
            const res = await fetch(`/api/workspaces/invitations/${invitation.id}/${action}`, {
                method: 'POST',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to ${action} invitation`);
            }

            toast.success(`Invitation ${action === 'accept' ? 'accepted' : 'declined'} successfully.`);

            onAction?.();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAccepting(false);
            setIsDeclining(false);
        }
    };

    return (
        <Card className="overflow-hidden border-orange-200 bg-orange-50/30">
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                        <CardTitle className="text-base">
                            Workspace Invitation
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            You've been invited to join <strong>{invitation.workspace_name || 'a workspace'}</strong>
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>Role: <span className="font-semibold capitalize text-foreground">{invitation.role}</span></span>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                    Received {formatDistanceToNow(new Date(invitation.created_at))} ago
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-2 flex gap-2">
                <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    onClick={() => handleAction('accept')}
                    disabled={isAccepting || isDeclining}
                >
                    {isAccepting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                    Accept
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAction('decline')}
                    disabled={isAccepting || isDeclining}
                >
                    {isDeclining ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                    Decline
                </Button>
            </CardFooter>
        </Card>
    );
}
