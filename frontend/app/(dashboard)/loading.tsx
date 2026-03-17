import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header placeholder - usually provided by layout but shown for completeness if needed */}
            <div className="h-16 border-b border-border px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton width={120} height={24} />
                    <Skeleton width={80} height={24} />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton width={32} height={32} borderRadius="50%" />
                    <Skeleton width={32} height={32} borderRadius="50%" />
                </div>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                    <div className="mb-8">
                        <Skeleton width="60%" height={40} className="mb-4" />
                        <Skeleton width="80%" height={24} />
                    </div>

                    {/* Banner Skeleton */}
                    <Skeleton width="100%" height={60} borderRadius={12} className="mb-8" />

                    {/* Form Skeleton */}
                    <div className="space-y-6">
                        <Skeleton width="100%" height={56} borderRadius={12} />
                        <div className="grid grid-cols-3 gap-4">
                            <Skeleton width="100%" height={48} borderRadius={12} />
                            <Skeleton width="100%" height={48} borderRadius={12} />
                            <Skeleton width="100%" height={48} borderRadius={12} />
                        </div>
                        <Skeleton width="100%" height={56} borderRadius={12} />
                    </div>
                </div>

                {/* Right Panel Skeleton */}
                <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-8">
                    <Skeleton width="100%" height={400} borderRadius={24} />
                    <Skeleton width="100%" height={160} borderRadius={24} />
                </div>
            </main>
        </div>
    );
}
