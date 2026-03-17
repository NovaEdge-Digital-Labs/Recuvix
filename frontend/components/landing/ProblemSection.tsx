"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThreeCanvas } from "./ThreeCanvas";

gsap.registerPlugin(ScrollTrigger);

export function ProblemSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                }
            });

            // Strikethrough animations for the pain points
            gsap.utils.toArray('.pain-point').forEach((point: any, index: number) => {
                tl.to(point.querySelector('.strikethrough-line'), {
                    scaleX: 1,
                    duration: 0.4,
                    ease: "power2.inOut",
                }, index * 0.5 + 0.5);

                tl.to(point.querySelector('.pain-icon'), {
                    color: "#666666",
                    duration: 0.2
                }, "<");

                // Show solution text right after strikethrough
                tl.to(point.querySelector('.solution-text'), {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                }, ">-0.2");
            });
        });

        return () => ctx.revert();
    }, []);

    const painPoints = [
        { pain: "Takes 6-8 hours per blog post", solution: "Ready in 3 minutes" },
        { pain: "Generic AI content gets penalized by Google", solution: "Humanized, undetectable output" },
        { pain: "SEO meta, images, thumbnails = 3 extra tools", solution: "All generated automatically" },
        { pain: "Results in 30+ days — if it ever comes", solution: "Ranks fast with perfect structure" }
    ];

    return (
        <section ref={sectionRef} id="problem" className="relative py-32 overflow-hidden border-b border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row gap-16 items-center">

                {/* Left Column */}
                <div className="flex-1 w-full">
                    <div className="mb-8">
                        <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                            THE PROBLEM
                        </span>
                        <h2 className="font-['Playfair_Display'] text-5xl md:text-[56px] italic leading-tight text-white m-0 reveal-text">
                            Writing good blogs is<br />
                            brutally hard.
                        </h2>
                    </div>

                    <div className="space-y-6 mt-12 w-full max-w-lg">
                        {painPoints.map((item, i) => (
                            <div key={i} className="pain-point relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <div className="relative group text-lg md:text-xl font-medium w-full sm:w-auto shrink-0 flex items-center">
                                    <span className="pain-icon text-red-500 mr-3 font-bold">×</span>
                                    <span className="text-[#a0a0a0]">{item.pain}</span>
                                    <div className="strikethrough-line absolute left-8 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-red-500/80 origin-left scale-x-0"></div>
                                </div>

                                {/* Checkmark Solution (slides in) */}
                                <div className="solution-text opacity-0 translate-x-4 flex items-center shrink-0">
                                    <span className="text-[#e8ff47] mx-2">→</span>
                                    <span className="text-white font-bold">{item.solution}</span>
                                    <span className="text-[#e8ff47] ml-2 font-bold">✓</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Visual */}
                <div className="flex-1 w-full h-[500px] relative mt-16 lg:mt-0 flex items-center justify-center">
                    {/* Mock Boring Blog (Background) */}
                    <div className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-xl p-8 overflow-hidden opacity-20 shadow-2xl skew-y-[-2deg] scale-95 pointer-events-none transition-opacity duration-1000" id="boring-blog-mock">
                        <div className="w-[60%] h-8 bg-white/20 rounded mb-6"></div>
                        <div className="w-full h-4 bg-white/10 rounded mb-3"></div>
                        <div className="w-[90%] h-4 bg-white/10 rounded mb-3"></div>
                        <div className="w-full h-4 bg-white/10 rounded mb-8"></div>
                        <div className="w-full h-48 bg-white/5 rounded mb-8 flex items-center justify-center">
                            <span className="text-white/20">Generic Stock Photo</span>
                        </div>
                    </div>

                    {/* Glowing Globe - using ThreeCanvas */}
                    <div className="w-[400px] h-[400px] relative z-10" id="globe-trigger">
                        <ThreeCanvas sceneType="globe" triggerSelector="#globe-trigger" />
                    </div>
                </div>
            </div>
        </section>
    );
}
