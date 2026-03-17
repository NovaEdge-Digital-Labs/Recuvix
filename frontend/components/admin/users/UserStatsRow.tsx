import React from 'react';
import { Users, UserPlus, Zap, Building } from 'lucide-react';

interface UserStatsRowProps {
    stats: {
        totalUsers: number;
        activeToday: number;
        newThisWeek: number;
        byokUsers: number;
        managedUsers: number;
    };
}

export const UserStatsRow = ({ stats }: UserStatsRowProps) => {
    const byokPercentage = stats.totalUsers > 0
        ? Math.round((stats.byokUsers / stats.totalUsers) * 100)
        : 0;

    const cards = [
        {
            label: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "New This Week",
            value: stats.newThisWeek.toLocaleString(),
            icon: UserPlus,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Active Today",
            value: stats.activeToday.toLocaleString(),
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "BYOK Users",
            value: `${stats.byokUsers.toLocaleString()} (${byokPercentage}%)`,
            icon: Building,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-500 text-sm font-medium">{card.label}</span>
                        <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                            <card.icon className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold tracking-tight text-white">
                        {card.value}
                    </div>
                </div>
            ))}
        </div>
    );
};
