import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Featured Post Skeleton */}
                <div className="relative w-full h-[400px] border border-border bg-card rounded-3xl overflow-hidden p-8 md:p-12 flex flex-col justify-end">
                    <div className="space-y-4 max-w-2xl relative z-10">
                        <Skeleton width={120} height={24} borderRadius={20} className="bg-accent/20" />
                        <Skeleton width="100%" height={48} />
                        <Skeleton width="80%" height={48} />
                        <div className="flex items-center gap-4 mt-6">
                            <Skeleton width={40} height={40} borderRadius="50%" />
                            <div className="space-y-2">
                                <Skeleton width={100} height={16} />
                                <Skeleton width={80} height={12} />
                            </div>
                        </div>
                    </div>
                    {/* Background Shimmer Mockup */}
                    <div className="absolute inset-0 opacity-20">
                        <Skeleton width="100%" height="100%" borderRadius={0} />
                    </div>
                </div>

                {/* Post Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton width="100%" height={240} borderRadius={20} />
                            <div className="space-y-2">
                                <Skeleton width={100} height={16} borderRadius={20} className="bg-accent/10" />
                                <Skeleton width="100%" height={28} />
                                <Skeleton width="60%" height={28} />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <Skeleton width={24} height={24} borderRadius="50%" />
                                <Skeleton width={80} height={12} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
