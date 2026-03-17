import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function CalendarLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <Skeleton width={180} height={32} />
                    <div className="flex gap-2">
                        <Skeleton width={100} height={40} borderRadius={8} />
                        <Skeleton width={100} height={40} borderRadius={8} />
                    </div>
                </div>

                {/* Calendar Grid Skeleton (7x5) */}
                <div className="border border-border bg-card rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-border bg-border/20">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="p-4 border-r border-border last:border-r-0">
                                <Skeleton width="40%" height={16} className="mx-auto" />
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
                        {[...Array(35)].map((_, i) => (
                            <div key={i} className="p-2 border-r border-b border-border last:border-r-0 group">
                                <div className="flex justify-between items-start mb-2">
                                    <Skeleton width={20} height={20} borderRadius="50%" />
                                </div>
                                {/* Randomly add some "event" skeletons to cells */}
                                {i % 4 === 0 && <Skeleton width="90%" height={24} borderRadius={4} className="mb-1" />}
                                {i % 7 === 0 && <Skeleton width="70%" height={24} borderRadius={4} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
