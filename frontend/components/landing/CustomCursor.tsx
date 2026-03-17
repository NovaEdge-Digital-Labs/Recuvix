"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only enable on non-touch devices
        if (typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
            return;
        }

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update dot immediately
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        };

        window.addEventListener("mousemove", onMouseMove);

        let animationId: number;
        let isHovering = false;

        // Connect to hoverable elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.bento-card')) {
                isHovering = true;
                ring.classList.add('cursor-hover');
            }
        };

        const handleMouseOut = () => {
            isHovering = false;
            ring.classList.remove('cursor-hover');
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        const render = () => {
            // Lerp for the ring
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);

        // Hide default cursor
        document.body.style.cursor = 'none';
        const hideCursors = () => {
            document.querySelectorAll('a, button, input').forEach(el => {
                (el as HTMLElement).style.cursor = 'none';
            });
        }
        // Need a timeout to ensure all DOM nodes are loaded or a mutation observer,
        // but applying cursor: none to body generally cascades down unless overridden.

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            cancelAnimationFrame(animationId);
            document.body.style.cursor = 'auto';
        };
    }, []);

    return (
        <>
            <div
                ref={ringRef}
                id="cursor-ring"
                className="fixed top-0 left-0 w-10 h-10 border border-[#e8ff47] rounded-full pointer-events-none z-[9999] opacity-80 mix-blend-difference transition-all duration-200 ease-out -ml-5 -mt-5"
            ></div>
            <div
                ref={dotRef}
                id="cursor-dot"
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#e8ff47] rounded-full pointer-events-none z-[9999] -ml-[3px] -mt-[3px]"
            ></div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .cursor-hover {
          transform: translate(-50%, -50%) scale(1.5) !important;
          background-color: rgba(232,255,71,0.1);
          border-color: rgba(232,255,71,0.5);
        }
        body * {
          cursor: none !important;
        }
      `}} />
        </>
    );
}
