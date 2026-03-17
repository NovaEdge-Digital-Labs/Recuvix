"use client";

function SkeletonBar({ widthClass }: { widthClass: string }) {
    return (
        <div
            className={`h-3.5 rounded ${widthClass} bg-[#1a1a1a]`}
            style={{ animation: "skeletonPulse 1.5s ease-in-out infinite" }}
        />
    );
}

const randomWidths = ["w-[42%]", "w-[58%]", "w-[65%]", "w-[50%]", "w-[72%]", "w-[48%]", "w-[60%]", "w-[55%]", "w-[68%]"];

export function OutlineSkeletonLoader({ rowCount = 6 }: { rowCount?: number }) {
    return (
        <>
            <style>{`
                @keyframes skeletonPulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
            `}</style>

            {/* H1 skeleton */}
            <div className="space-y-3 mb-6">
                <div className="h-7 rounded w-[60%] bg-[#1a1a1a]"
                    style={{ animation: "skeletonPulse 1.5s ease-in-out infinite" }} />
                <div className="flex gap-2">
                    <div className="h-5 w-24 rounded-full bg-[#1a1a1a]"
                        style={{ animation: "skeletonPulse 1.5s ease-in-out infinite 0.2s" }} />
                    <div className="h-5 w-20 rounded-full bg-[#1a1a1a]"
                        style={{ animation: "skeletonPulse 1.5s ease-in-out infinite 0.3s" }} />
                </div>
                <SkeletonBar widthClass="w-[90%]" />
            </div>

            {/* H2 skeletons */}
            <div className="space-y-2">
                {Array.from({ length: rowCount }).map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#1a1a1a]"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Drag handle placeholder */}
                        <div className="w-4 h-4 rounded bg-[#1a1a1a]"
                            style={{ animation: "skeletonPulse 1.5s ease-in-out infinite" }} />
                        {/* Number placeholder */}
                        <div className="w-6 h-3.5 rounded bg-[#1a1a1a]"
                            style={{ animation: "skeletonPulse 1.5s ease-in-out infinite" }} />
                        {/* Text placeholder */}
                        <SkeletonBar widthClass={randomWidths[i % randomWidths.length]} />
                    </div>
                ))}
            </div>
        </>
    );
}
