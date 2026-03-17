import React from 'react';
import { Skeleton } from "@/components/ui/Skeleton";

export default function DocsLoading() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col">
            {/* Search/Header Skeleton */}
            <div className="h-16 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#050505] z-10">
                <div className="flex items-center gap-8">
                    <Skeleton width={100} height={24} />
                    <Skeleton width={300} height={36} borderRadius={8} />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton width={80} height={24} />
                    <Skeleton width={32} height={32} borderRadius="50%" />
                </div>
            </div>

            <div className="flex-1 flex w-full max-w-[1400px] mx-auto">
                {/* Left Sidebar Skeleton */}
                <aside className="hidden lg:block w-64 border-r border-white/5 p-8 space-y-8 h-[calc(100vh-4rem)] sticky top-16">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton width="40%" height={14} />
                            <div className="space-y-3">
                                <Skeleton width="80%" height={12} />
                                <Skeleton width="70%" height={12} />
                                <Skeleton width="85%" height={12} />
                                <Skeleton width="60%" height={12} />
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Center Content Skeleton */}
                <main className="flex-1 p-8 md:p-12 lg:p-16 max-w-4xl">
                    <div className="space-y-6 mb-12">
                        <Skeleton width="70%" height={48} />
                        <div className="flex items-center gap-4">
                            <Skeleton width={120} height={12} />
                            <Skeleton width={80} height={12} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton width="100%" height={20} />
                                <Skeleton width="98%" height={20} />
                                <Skeleton width="95%" height={20} />
                                <Skeleton width="60%" height={20} />
                            </div>
                        ))}
                    </div>
                </main>

                {/* Right TOC Skeleton */}
                <aside className="hidden xl:block w-64 p-8 space-y-6 h-[calc(100vh-4rem)] sticky top-16">
                    <Skeleton width="60%" height={12} />
                    <div className="space-y-4">
                        <Skeleton width="80%" height={10} />
                        <Skeleton width="70%" height={10} />
                        <Skeleton width="85%" height={10} />
                        <Skeleton width="60%" height={10} />
                        <Skeleton width="75%" height={10} />
                    </div>
                </aside>
            </div>
        </div>
    );
}
