import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export function HowItWorks() {
    const containerRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const ctx = gsap.context(() => {
            // Horizontal Scroll Animation
            const getScrollAmount = () => {
                let trackWidth = track.scrollWidth || 0;
                return -(trackWidth - window.innerWidth);
            };

            gsap.to(track, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+=${Math.abs(getScrollAmount()) + 500}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            // Typewriter animation trigger
            gsap.to('.typing-text', {
                text: "Digital Marketing Tips for Indian Startups",
                duration: 2,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 20%",
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} id="how-it-works" className="relative h-screen bg-[#050505] overflow-hidden flex items-center border-b border-white/[0.06]">
            <div className="absolute top-24 left-6 md:left-12 z-20">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                    THE PROCESS
                </span>
                <h2 className="font-['Bebas_Neue'] text-6xl md:text-[100px] leading-[0.85] text-white m-0 tracking-tight">
                    THREE STEPS.<br />
                    ONE BLOG.
                </h2>
            </div>

            <div ref={trackRef} className="flex h-full items-center pt-32 w-[300vw] min-w-max relative z-10 pl-6 md:pl-12">

                {/* STEP 1 */}
                <div className="w-[100vw] sm:w-[80vw] md:w-[60vw] h-[60vh] flex flex-col justify-center px-12 relative shrink-0">
                    <div className="absolute inset-0 font-['Bebas_Neue'] text-[300px] md:text-[400px] text-transparent leading-none z-0 select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.04)' }}>
                        01
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-[#e8ff47]/10 text-[#e8ff47] font-['JetBrains_Mono'] text-xs font-bold rounded mb-6 border border-[#e8ff47]/20">STEP ONE</span>
                        <h3 className="font-['Playfair_Display'] italic text-4xl md:text-5xl text-white mb-6">Type Your Topic</h3>
                        <p className="font-['Outfit'] text-[#a0a0a0] text-lg max-w-sm leading-relaxed mb-8">
                            Enter any topic or paste a title. Choose your country, tone, and word count. Add your brand details once.
                        </p>

                        {/* Visual */}
                        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e8ff47]/30 to-transparent"></div>
                            <label className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-['JetBrains_Mono']">Topic</label>
                            <div className="w-full bg-[#111111] border border-white/5 p-4 rounded text-white font-['Outfit'] text-sm flex items-center h-14">
                                <span className="typing-text relative after:content-[''] after:w-[2px] after:h-4 after:bg-[#e8ff47] after:absolute after:right-[-4px] after:top-1/2 after:-translate-y-1/2 after:animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 2 */}
                <div className="w-[100vw] sm:w-[80vw] md:w-[60vw] h-[60vh] flex flex-col justify-center px-12 relative shrink-0">
                    <div className="absolute inset-0 font-['Bebas_Neue'] text-[300px] md:text-[400px] text-transparent leading-none z-0 select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.04)' }}>
                        02
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-['Playfair_Display'] italic text-4xl md:text-5xl text-white mb-6">AI Does Everything</h3>
                        <p className="font-['Outfit'] text-[#a0a0a0] text-lg max-w-sm leading-relaxed mb-8">
                            We write the blog, source images, generate a thumbnail, build the SEO meta pack, and package it in HTML, Markdown, or XML.
                        </p>

                        {/* Visual */}
                        <div className="w-full max-w-md space-y-3">
                            {['Analysing topic', 'Writing 1,847 words', 'Sourcing 4 images', 'Creating thumbnail', 'Building SEO pack'].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 bg-[#0d0d0d] border border-[#e8ff47]/20 rounded-md p-3 px-4 shadow-lg w-fit">
                                    <span className="text-[#e8ff47] font-bold">✓</span>
                                    <span className="text-white text-sm font-['Outfit']">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STEP 3 */}
                <div className="w-[100vw] sm:w-[80vw] md:w-[60vw] h-[60vh] flex flex-col justify-center px-12 relative shrink-0">
                    <div className="absolute inset-0 font-['Bebas_Neue'] text-[300px] md:text-[400px] text-transparent leading-none z-0 select-none pointer-events-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.04)' }}>
                        03
                    </div>
                    <div className="relative z-10">
                        <h3 className="font-['Playfair_Display'] italic text-4xl md:text-5xl text-white mb-6">Publish. Rank. Grow.</h3>
                        <p className="font-['Outfit'] text-[#a0a0a0] text-lg max-w-sm leading-relaxed mb-8">
                            Download your blog or publish directly to WordPress. Track rankings in Google Search Console. Watch your traffic climb.
                        </p>

                        {/* Visual */}
                        <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-2xl h-48 relative flex items-end">
                            {/* Fake chart */}
                            <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <path d="M0 45 Q 20 40, 40 30 T 70 15 T 100 5 L 100 50 L 0 50 Z" fill="url(#grad)" opacity="0.2" />
                                <path d="M0 45 Q 20 40, 40 30 T 70 15 T 100 5" fill="none" stroke="#e8ff47" strokeWidth="2" strokeDasharray="150" strokeDashoffset="0" className="chart-line" />
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#e8ff47" />
                                        <stop offset="100%" stopColor="#050505" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute top-4 left-4">
                                <span className="text-white/40 text-xs font-['JetBrains_Mono']">Organic Traffic</span>
                                <div className="text-white font-bold text-2xl mt-1">+342%</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
