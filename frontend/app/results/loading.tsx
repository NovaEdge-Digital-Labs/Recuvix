import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function ResultsLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Content */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="space-y-4">
                        <Skeleton width="40%" height={32} />
                        <div className="space-y-2">
                            <Skeleton width="100%" height={20} />
                            <Skeleton width="100%" height={20} />
                            <Skeleton width="95%" height={20} />
                            <Skeleton width="98%" height={20} />
                            <Skeleton width="90%" height={20} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Skeleton width="30%" height={28} />
                        <div className="space-y-2">
                            <Skeleton width="100%" height={20} />
                            <Skeleton width="100%" height={20} />
                            <Skeleton width="92%" height={20} />
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-4 space-y-4">
                    <Skeleton width="100%" height={56} borderRadius={12} />
                    <Skeleton width="100%" height={56} borderRadius={12} />
                    <Skeleton width="100%" height={56} borderRadius={12} />
                </div>
            </div>
        </div>
    );
}
