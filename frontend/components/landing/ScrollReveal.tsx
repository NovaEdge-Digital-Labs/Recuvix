"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    stagger = false,
    yDir = 60
}: {
    children: React.ReactNode,
    className?: string,
    delay?: number,
    stagger?: boolean,
    yDir?: number
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            if (stagger) {
                const elements = Array.from(el.children);
                gsap.fromTo(elements,
                    { y: yDir, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out",
                        delay: delay,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            } else {
                gsap.fromTo(el,
                    { y: yDir, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        delay: delay,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, [delay, stagger, yDir]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
