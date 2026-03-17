import React from 'react';
import {
    MoreHorizontal,
    ExternalLink,
    Gift,
    StickyNote,
    UserCog,
    ShieldAlert,
    ShieldCheck,
    Download
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";

interface UserRowActionsProps {
    user: any;
    onViewDetails: (user: any) => void;
    onGiveCredits: (user: any) => void;
    onSuspend: (user: any) => void;
    onUnsuspend: (user: any) => void;
    onUpdateLabel: (userId: string, label: string) => void;
}

export const UserRowActions = ({
    user,
    onViewDetails,
    onGiveCredits,
    onSuspend,
    onUnsuspend,
    onUpdateLabel
}: UserRowActionsProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-500 hover:text-white">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-900 text-white">
                <DropdownMenuItem onClick={() => onViewDetails(user)} className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
                    <ExternalLink className="w-4 h-4" />
                    View Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onGiveCredits(user)} className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
                    <Gift className="w-4 h-4" />
                    Give Free Credits
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-zinc-900" />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
                        <UserCog className="w-4 h-4" />
                        Set Label
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-zinc-950 border-zinc-900 text-white">
                        {['None', 'VIP', 'Agency', 'Influencer', 'Flagged'].map((label) => (
                            <DropdownMenuItem
                                key={label}
                                onClick={() => onUpdateLabel(user.id, label.toLowerCase())}
                                className="cursor-pointer focus:bg-zinc-900 focus:text-white"
                            >
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
                    <StickyNote className="w-4 h-4" />
                    Add Internal Note
                </DropdownMenuItem>

                <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-zinc-900 focus:text-white">
                    <Download className="w-4 h-4" />
                    Export User Data
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-zinc-900" />

                {user.is_suspended ? (
                    <DropdownMenuItem onClick={() => onUnsuspend(user)} className="gap-2 cursor-pointer text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500">
                        <ShieldCheck className="w-4 h-4" />
                        Unsuspend Account
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => onSuspend(user)} className="gap-2 cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500">
                        <ShieldAlert className="w-4 h-4" />
                        Suspend Account
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
