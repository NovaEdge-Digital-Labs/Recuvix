import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrackerLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-2">
                    <Skeleton width={200} height={32} />
                    <Skeleton width={300} height={20} />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="border border-border bg-card rounded-xl p-6 space-y-3">
                            <Skeleton width={80} height={16} />
                            <Skeleton width="60%" height={32} />
                            <Skeleton width="40%" height={12} />
                        </div>
                    ))}
                </div>

                {/* Chart Area Skeleton */}
                <div className="border border-border bg-card rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <Skeleton width={150} height={24} />
                        <div className="flex gap-2">
                            <Skeleton width={80} height={32} borderRadius={8} />
                            <Skeleton width={80} height={32} borderRadius={8} />
                        </div>
                    </div>
                    <Skeleton width="100%" height={300} borderRadius={12} />
                </div>
            </div>
        </div>
    );
}
