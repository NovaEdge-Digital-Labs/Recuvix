import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function HistoryLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Skeleton width={200} height={32} className="mb-4" />
                    <Skeleton width={300} height={20} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border border-border bg-card rounded-2xl p-6 space-y-4">
                            <Skeleton width="100%" height={160} borderRadius={12} />
                            <div className="space-y-2">
                                <Skeleton width="80%" height={24} />
                                <Skeleton width="60%" height={24} />
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                                <Skeleton width={80} height={16} />
                                <Skeleton width={60} height={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
