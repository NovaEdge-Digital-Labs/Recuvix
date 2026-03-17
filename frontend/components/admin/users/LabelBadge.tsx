import React from 'react';
import { Crown, Building2, Star, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

export type UserLabel = 'vip' | 'agency' | 'influencer' | 'flagged' | 'none';

interface LabelBadgeProps {
    label: UserLabel | string;
    className?: string;
}

export const LabelBadge = ({ label, className }: LabelBadgeProps) => {
    if (!label || label === 'none') return null;

    const config: Record<string, { icon: any; color: string; label: string; bg: string; border: string }> = {
        vip: {
            icon: Crown,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            label: 'VIP',
        },
        agency: {
            icon: Building2,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            label: 'Agency',
        },
        influencer: {
            icon: Star,
            color: 'text-pink-500',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            label: 'Influencer',
        },
        flagged: {
            icon: Flag,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            label: 'Flagged',
        },
    };

    const item = config[label.toLowerCase()] || {
        icon: Star,
        color: 'text-zinc-400',
        bg: 'bg-zinc-400/10',
        border: 'border-zinc-400/20',
        label: label,
    };

    const Icon = item.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider",
            item.bg,
            item.color,
            item.border,
            className
        )}>
            <Icon className="w-3 h-3" />
            {item.label}
        </div>
    );
};
