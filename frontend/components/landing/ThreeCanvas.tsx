"use client";

import { useEffect, useRef } from "react";
import { initHeroParticles, initGlobe, initStatsNumbers, initIcosahedron } from "../../lib/landing/threeScenes";

interface ThreeCanvasProps {
    sceneType: "hero-particles" | "globe" | "stats" | "icosahedron";
    className?: string;
    triggerSelector?: string; // Optional CSS selector for ScrollTrigger to scale/animate
}

export function ThreeCanvas({ sceneType, className = "", triggerSelector }: ThreeCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !(window as any).THREE) return;

        const container = containerRef.current;
        if (!container) return;

        let cleanupFunction: (() => void) | undefined;

        // Use Intersection Observer for lazy init
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !cleanupFunction) {
                        // Init scene
                        switch (sceneType) {
                            case "hero-particles":
                                cleanupFunction = initHeroParticles(container);
                                break;
                            case "globe":
                                cleanupFunction = initGlobe(container, triggerSelector);
                                break;
                            case "stats":
                                cleanupFunction = initStatsNumbers(container);
                                break;
                            case "icosahedron":
                                cleanupFunction = initIcosahedron(container, triggerSelector);
                                break;
                        }
                    } else if (!entry.isIntersecting && cleanupFunction) {
                        // Can optionally pause animation loop here by setting a flag in the cleanup function, 
                        // but for now we just let it run or clean it up completely if memory is tight.
                        // Usually, we just pause the requestAnimationFrame loop inside the logic.
                    }
                });
            },
            { rootMargin: "200px" } // Load slightly before it comes into view
        );

        observer.observe(container);

        return () => {
            observer.disconnect();
            if (cleanupFunction) {
                cleanupFunction();
            }
        };
    }, [sceneType, triggerSelector]);

    return <div ref={containerRef} className={`relative w-full h-full ${className}`} />;
}
