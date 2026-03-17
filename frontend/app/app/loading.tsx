import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header placeholder */}
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
                {/* Left Column: Form Skeleton */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                    <div>
                        <Skeleton width="60%" height={40} className="mb-4" />
                        <Skeleton width="80%" height={24} />
                    </div>

                    {/* Banner Placeholder */}
                    <Skeleton width="100%" height={60} borderRadius={12} />

                    {/* Form Section Placeholder */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton width={100} height={16} />
                            <Skeleton width="100%" height={48} borderRadius={12} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton width={80} height={16} />
                                <Skeleton width="100%" height={48} borderRadius={12} />
                            </div>
                            <div className="space-y-2">
                                <Skeleton width={80} height={16} />
                                <Skeleton width="100%" height={48} borderRadius={12} />
                            </div>
                        </div>
                        <Skeleton width="100%" height={48} borderRadius={12} />
                    </div>
                </div>

                {/* Right Column: Preview/Box Skeleton */}
                <div className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-8">
                    <div className="w-full aspect-square border border-border bg-card/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-6">
                        <Skeleton width={64} height={64} borderRadius={16} />
                        <Skeleton width="70%" height={24} />
                        <div className="w-full space-y-2">
                            <Skeleton width="90%" height={14} />
                            <Skeleton width="85%" height={14} />
                            <Skeleton width="100%" height={14} />
                        </div>
                    </div>

                    {/* Secondary Card Placeholder */}
                    <div className="p-6 border border-border bg-card/50 rounded-2xl space-y-4">
                        <div className="flex gap-4">
                            <Skeleton width={48} height={48} borderRadius={12} />
                            <div className="space-y-2 flex-1">
                                <Skeleton width="60%" height={20} />
                                <Skeleton width="40%" height={12} />
                            </div>
                        </div>
                        <Skeleton width="100%" height={12} />
                        <Skeleton width="100%" height={44} borderRadius={8} />
                    </div>
                </div>
            </main>
        </div>
    );
}
