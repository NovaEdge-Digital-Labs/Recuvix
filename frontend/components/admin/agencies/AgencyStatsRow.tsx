import React from 'react';
import { Building2, TrendingUp, Users, Wallet } from 'lucide-react';

interface AgencyStatsRowProps {
    stats: {
        totalAgencies: number;
        activeAgencies: number;
        trialAgencies: number;
        totalMRR: number;
        totalRevenueThisMonth: number;
        pendingPayouts: number;
    };
}

export const AgencyStatsRow = ({ stats }: AgencyStatsRowProps) => {
    const cards = [
        {
            label: "Total Agencies",
            value: stats.totalAgencies.toLocaleString(),
            subvalue: `${stats.activeAgencies} Active, ${stats.trialAgencies} Trial`,
            icon: Building2,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Total MRR",
            value: `₹${stats.totalMRR.toLocaleString()}`,
            subvalue: "Monthly License Revenue",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Revenue This Month",
            value: `₹${stats.totalRevenueThisMonth.toLocaleString()}`,
            subvalue: "Total Platform Transaction Vol",
            icon: Users,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
        {
            label: "Pending Payouts",
            value: `₹${stats.pendingPayouts.toLocaleString()}`,
            subvalue: "Due to Agencies",
            icon: Wallet,
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
                    <div className="space-y-1">
                        <div className="text-2xl font-bold tracking-tight text-white">
                            {card.value}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                            {card.subvalue}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
