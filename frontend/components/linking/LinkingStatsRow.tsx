import React from 'react';
import { Card } from '@/components/ui/card';
import {
    FileText,
    Link as LinkIcon,
    AlertTriangle,
    Share2
} from 'lucide-react';

interface LinkingStatsRowProps {
    stats: {
        totalLinks: number;
        totalBlogs: number;
        orphanCount: number;
        avgLinksPerBlog: string | number;
    };
}

export function LinkingStatsRow({ stats }: LinkingStatsRowProps) {
    const items = [
        {
            label: 'Total Blogs',
            value: stats.totalBlogs,
            icon: FileText,
            color: 'text-zinc-400',
            bg: 'bg-zinc-500/5'
        },
        {
            label: 'Total Applied Links',
            value: stats.totalLinks,
            icon: LinkIcon,
            color: 'text-accent',
            bg: 'bg-accent/5'
        },
        {
            label: 'Orphan Blogs',
            value: stats.orphanCount,
            icon: AlertTriangle,
            color: stats.orphanCount > 0 ? 'text-red-400' : 'text-green-400',
            bg: stats.orphanCount > 0 ? 'bg-red-400/5' : 'bg-green-400/5'
        },
        {
            label: 'Avg Links / Blog',
            value: stats.avgLinksPerBlog,
            icon: Share2,
            color: 'text-blue-400',
            bg: 'bg-blue-400/5'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <Card key={i} className="border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${item.bg}`}>
                            <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">
                                {item.label}
                            </p>
                            <h4 className="text-xl font-black text-zinc-100 italic">
                                {item.value}
                            </h4>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
