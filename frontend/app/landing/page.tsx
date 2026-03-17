"use client";

import { useEffect, useState } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { LogoStrip } from "@/components/landing/LogoStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { WhiteLabelTeaser } from "@/components/landing/WhiteLabelTeaser";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { CustomCursor } from "@/components/landing/CustomCursor";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

export default function LandingPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        if (typeof window !== "undefined" && (window as any).gsap && (window as any).ScrollTrigger && (window as any).Lenis) {
            const gsap = (window as any).gsap;
            const ScrollTrigger = (window as any).ScrollTrigger;
            const Lenis = (window as any).Lenis;

            // Initialize Lenis
            const lenis = new Lenis({
                duration: 1.4,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
            });

            const raf = (time: number) => {
                lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);

            // Connect Lenis to ScrollTrigger
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time: number) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }, []);

    if (!isMounted) return null; // Avoid hydration mismatch

    return (
        <>
            <CustomCursor />
            <LandingNav />
            <main className="bg-[#050505] selection:bg-[#e8ff47] selection:text-black">
                <HeroSection />

                <ScrollReveal>
                    <LogoStrip />
                </ScrollReveal>

                <ScrollReveal yDir={100}>
                    <ProblemSection />
                </ScrollReveal>

                {/* <ScrollReveal> */}
                <HowItWorks />
                {/* </ScrollReveal> */}

                <ScrollReveal stagger>
                    <FeaturesGrid />
                </ScrollReveal>

                <ScrollReveal>
                    <StatsSection />
                </ScrollReveal>

                <ScrollReveal yDir={80}>
                    <PricingSection />
                </ScrollReveal>

                <ScrollReveal>
                    <WhiteLabelTeaser />
                </ScrollReveal>

                <ScrollReveal stagger>
                    <Testimonials />
                </ScrollReveal>

                <ScrollReveal>
                    <FAQSection />
                </ScrollReveal>

                <ScrollReveal yDir={40}>
                    <FinalCTA />
                </ScrollReveal>
            </main>
            <LandingFooter />
        </>
    );
}
