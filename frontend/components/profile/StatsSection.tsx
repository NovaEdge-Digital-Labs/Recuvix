'use client';

import { LineChart, FileText, Star, Globe2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function StatsSection() {
    const { profile } = useAuth();

    const stats = [
        {
            label: 'Blogs Generated',
            value: profile?.blogs_generated_count?.toLocaleString() || '0',
            icon: FileText,
        },
        {
            label: 'Words Generated',
            value: profile?.total_words_generated
                ? profile.total_words_generated.toLocaleString()
                : '0',
            icon: LineChart,
        },
        {
            label: 'Plan',
            value: profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : 'Free',
            icon: Star,
        },
        {
            label: 'Member Since',
            value: profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : '—',
            icon: Globe2,
        },
    ];

    return (
        <div className="bg-card border border-border rounded-2xl divide-y divide-border" id="stats">
            <div className="p-6">
                <h2 className="font-bold text-foreground text-lg">Usage Stats</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Your Recuvix activity at a glance</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="p-4 bg-background border border-border rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Icon size={14} className="text-muted-foreground" />
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{label}</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
