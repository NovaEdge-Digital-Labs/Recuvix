import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function LinkingLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Suggestions */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-2 mb-8">
                        <Skeleton width="40%" height={32} />
                        <Skeleton width="60%" height={20} />
                    </div>

                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border border-border bg-card rounded-xl p-6 flex gap-6">
                            <Skeleton width={100} height={100} borderRadius={12} className="shrink-0" />
                            <div className="flex-1 space-y-3">
                                <Skeleton width="70%" height={24} />
                                <Skeleton width="100%" height={16} />
                                <Skeleton width="90%" height={16} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Selector */}
                <div className="lg:col-span-4">
                    <div className="border border-border bg-card rounded-2xl p-6 sticky top-24">
                        <Skeleton width="80%" height={24} className="mb-6" />
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton width={16} height={16} borderRadius={4} />
                                    <Skeleton width="100%" height={20} />
                                </div>
                            ))}
                        </div>
                        <Skeleton width="100%" height={48} borderRadius={12} className="mt-8" />
                    </div>
                </div>
            </div>
        </div>
    );
}
