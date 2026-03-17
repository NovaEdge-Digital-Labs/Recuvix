"use client";

import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
    PlusCircle,
    Settings,
    UserPlus,
    FileText,
    ShieldCheck,
    CreditCard,
    MoreHorizontal,
    LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { workspacesService } from '@/lib/db/workspacesService';
// workspace_activity is not in generated types yet — use a local interface
interface Activity {
    id: string;
    workspace_id: string;
    actor_id: string | null;
    type: string;
    metadata: Record<string, any> | null;
    created_at: string;
}

const ACTION_ICONS: Record<string, LucideIcon> = {
    'workspace_created': PlusCircle,
    'member_invited': UserPlus,
    'member_joined': UserPlus,
    'blog_generated': FileText,
    'blog_approved': ShieldCheck,
    'settings_changed': Settings,
    'credits_purchased': CreditCard,
};

const ACTION_COLORS: Record<string, string> = {
    'workspace_created': 'text-green-500 bg-green-500/10',
    'member_invited': 'text-blue-500 bg-blue-500/10',
    'member_joined': 'text-blue-500 bg-blue-500/10',
    'blog_generated': 'text-purple-500 bg-purple-500/10',
    'blog_approved': 'text-amber-500 bg-amber-500/10',
    'settings_changed': 'text-slate-500 bg-slate-500/10',
    'credits_purchased': 'text-emerald-500 bg-emerald-500/10',
};

function ActivityItem({ activity }: { activity: Activity }) {
    const Icon = (ACTION_ICONS[activity.type] || MoreHorizontal) as LucideIcon;
    const colorClass = ACTION_COLORS[activity.type] || 'text-muted-foreground bg-muted';
    const emailStr = (activity.metadata?.user_email as string) || '';

    const getActionLabel = () => {
        switch (activity.type) {
            case 'workspace_created': return 'created the workspace';
            case 'member_invited': return `invited ${activity.metadata?.email || 'a new member'}`;
            case 'member_joined': return 'joined the workspace';
            case 'blog_generated': return `generated blog: ${activity.metadata?.entity_name || 'Untitled'}`;
            case 'blog_approved': return `approved blog: ${activity.metadata?.entity_name || 'Untitled'}`;
            case 'settings_changed': return 'updated workspace settings';
            case 'credits_purchased': return `purchased ${activity.metadata?.amount || 0} credits`;
            default: return activity.type;
        }
    };

    return (
        <div className="flex gap-4 py-3 first:pt-0 last:pb-0">
            <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", colorClass)}>
                <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm">
                    <span className="font-medium text-foreground">{emailStr.split('@')[0]}</span>
                    {' '}
                    <span className="text-muted-foreground">{getActionLabel()}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
            </div>
        </div>
    );
}

export function WorkspaceActivityFeed({ workspaceId, limit = 10 }: { workspaceId: string, limit?: number }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const data = await workspacesService.getActivity(workspaceId, limit);
                setActivities(data as Activity[]);
            } catch (err) {
                console.error('Failed to load activity:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [workspaceId, limit]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="size-8 rounded-full bg-muted shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="divide-y border-t lg:border-none">
            {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
            ))}
        </div>
    );
}
