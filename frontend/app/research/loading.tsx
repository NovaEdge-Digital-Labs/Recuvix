import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function ResearchLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-4 w-full md:w-2/3">
                        <Skeleton width="40%" height={32} />
                        <Skeleton width="80%" height={24} />
                    </div>
                    <Skeleton width={120} height={48} borderRadius={12} className="shrink-0" />
                </div>

                {/* Search Bar Skeleton */}
                <Skeleton width="100%" height={56} borderRadius={12} />

                {/* Topic Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="border border-border bg-card rounded-xl p-6 space-y-4">
                            <Skeleton width={40} height={40} borderRadius={8} />
                            <div className="space-y-2">
                                <Skeleton width="100%" height={20} />
                                <Skeleton width="60%" height={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
