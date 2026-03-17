import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

interface HistoryBreadcrumbProps {
    date?: string;
}

export const HistoryBreadcrumb: React.FC<HistoryBreadcrumbProps> = ({ date }) => {
    return (
        <div className="w-full bg-card/50 border-b border-slate-800 px-6 py-3">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                <Link
                    href="/history"
                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80 hover:text-accent transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Blog History
                </Link>

                {date && (
                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <Clock size={14} className="text-accent" />
                        Viewing Saved Blog from {new Date(date).toLocaleDateString()}
                    </div>
                )}
            </div>
        </div>
    );
};
