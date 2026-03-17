import { Badge } from "@/components/ui/badge";

export function PricingHero() {
    return (
        <div className="relative pt-20 pb-16 text-center lg:pt-32 overflow-hidden">
            <div className="container px-4 mx-auto max-w-7xl relative z-10">
                <Badge variant="outline" className="mb-4 text-accent border-accent/20 bg-accent/5 backdrop-blur-sm">
                    Flexible Pricing
                </Badge>
                <h1 className="max-w-4xl mx-auto mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    Scale your content engine with <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">Credits</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg leading-8 text-zinc-400">
                    Choose a credit pack that fits your volume. Managed mode handles API keys, rate limits, and model optimization for you.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-zinc-900/50 text-zinc-300 border border-zinc-800 shadow-inner">
                        <span className="flex w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        No monthly subscription
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-zinc-900/50 text-zinc-300 border border-zinc-800 shadow-inner">
                        <span className="flex w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Credits never expire
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-zinc-900/50 text-zinc-300 border border-zinc-800 shadow-inner">
                        <span className="flex w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                        Unused credits roll over
                    </div>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:-top-12 md:-top-20 lg:-top-32" aria-hidden="true">
                <svg viewBox="0 0 1024 1024" className="absolute top-0 left-1/2 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(35%_35%_at_50%_50%,white,transparent)]" aria-hidden="true">
                    <circle cx="512" cy="512" r="512" fill="url(#pricing-gradient)" fillOpacity="0.15" />
                    <defs>
                        <radialGradient id="pricing-gradient">
                            <stop stopColor="#3b82f6" />
                            <stop offset="1" stopColor="#6366f1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
