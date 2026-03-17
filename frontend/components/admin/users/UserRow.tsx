import React from 'react';
import { LabelBadge } from './LabelBadge';
import { UserRowActions } from './UserRowActions';
import { ShieldAlert, CreditCard, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';

interface UserRowProps {
    user: any;
    onViewDetails: (user: any) => void;
    onViewTree: (user: any) => void;
    onGiveCredits: (user: any) => void;
    onSuspend: (user: any) => void;
    onUnsuspend: (user: any) => void;
    onUpdateLabel: (userId: string, label: string) => void;
}

export const UserRow = ({
    user,
    onViewDetails,
    onViewTree,
    onGiveCredits,
    onSuspend,
    onUnsuspend,
    onUpdateLabel
}: UserRowProps) => {
    return (
        <tr className={`border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-colors group ${user.is_suspended ? 'bg-red-500/5' : ''}`}>
            <td className="py-4 pl-4 pr-3 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-sm font-bold border border-zinc-800 text-zinc-400">
                        {user.full_name?.[0] || user.email?.[0]}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-white flex items-center gap-2">
                            {user.full_name || 'No Name'}
                            {user.is_suspended && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                        </div>
                        <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                    <LabelBadge label={user.user_label || 'none'} />
                    <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-tighter">
                        {user.tenantName}
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-white font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                    {user.credits_balance}
                </div>
                <div className="text-[10px] text-zinc-500 italic">
                    {user.total_free_credits_received || 0} free received
                </div>
            </td>
            <td
                className="px-3 py-4 whitespace-nowrap cursor-pointer hover:bg-zinc-800/40 transition-colors"
                onClick={() => onViewTree(user)}
                title="View Referral Tree"
            >
                <div className="flex items-center gap-1.5 text-white font-medium">
                    <Users className="w-3.5 h-3.5 text-accent" />
                    {user.total_referrals || 0}
                </div>
                <div className="text-[10px] text-zinc-500 italic">
                    {user.total_referral_credits_earned || 0} credits earned
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-white font-medium">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    {user.total_blogs_generated || 0}
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-xs text-zinc-400">{format(new Date(user.created_at), 'MMM dd, yyyy')}</div>
                <div className="text-[10px] text-zinc-600 italic">
                    Last active: {user.last_active_at ? format(new Date(user.last_active_at), 'MMM dd') : 'Never'}
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-right pr-4">
                <UserRowActions
                    user={user}
                    onViewDetails={onViewDetails}
                    onGiveCredits={onGiveCredits}
                    onSuspend={onSuspend}
                    onUnsuspend={onUnsuspend}
                    onUpdateLabel={onUpdateLabel}
                />
            </td>
        </tr>
    );
};
