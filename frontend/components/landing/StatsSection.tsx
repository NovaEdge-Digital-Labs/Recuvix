import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThreeCanvas } from "./ThreeCanvas";

gsap.registerPlugin(ScrollTrigger);

export function StatsSection() {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Counters animation
            gsap.utils.toArray('.stat-counter').forEach((counter: any) => {
                const targetValue = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = targetValue % 1 !== 0;

                gsap.to(counter, {
                    innerHTML: targetValue,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    },
                    snap: { innerHTML: isDecimal ? 0.1 : 1 },
                    onUpdate: function () {
                        if (isDecimal) {
                            counter.innerHTML = Number(counter.innerHTML).toFixed(1);
                        }
                    }
                });
            });

            // Underline drawing animation
            gsap.to('.stat-underline', {
                scaleX: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const stats = [
        { target: 2400, prefix: "", suffix: "+", label: "Bloggers & Agencies" },
        { target: 12, prefix: "", suffix: "", label: "Languages Supported" },
        { target: 3, prefix: "< ", suffix: "min", label: "Average Generation Time" },
        { target: 4.9, prefix: "", suffix: "★", label: "Average Rating" },
    ];

    return (
        <section ref={containerRef} className="relative py-24 bg-[#0d0d0d] border-b border-white/[0.06] overflow-hidden">
            {/* Decorative Background Text */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
                <ThreeCanvas sceneType="stats" className="absolute inset-0 opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-['Bebas_Neue'] text-[30vw] text-transparent leading-none opacity-2 whitespace-nowrap" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                        RECUVIX
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col relative group">
                            <div className="font-['Bebas_Neue'] text-[64px] md:text-[80px] text-[#e8ff47] leading-none mb-2 drop-shadow-[0_0_15px_rgba(232,255,71,0.2)]">
                                {stat.prefix}
                                <span className="stat-counter" data-target={stat.target}>0</span>
                                {stat.suffix}
                            </div>
                            <div className="font-['Outfit'] text-[14px] text-[#666666] font-medium tracking-wide">
                                {stat.label}
                            </div>

                            {/* Stat highlight underline */}
                            <div className="stat-underline absolute -bottom-4 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 w-10 h-[2px] bg-[#e8ff47] scale-x-0 origin-left"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
