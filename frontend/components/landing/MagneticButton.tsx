"use client";

import React, { useEffect, useRef } from "react";

export function MagneticButton({
    children,
    className = "",
    onClick,
    href,
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
}) {
    const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    useEffect(() => {
        const element = buttonRef.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull: adjust multipliers for strength
            element.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        };

        const handleMouseLeave = () => {
            element.style.transform = `translate(0px, 0px)`;
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave as any);

        return () => {
            element.removeEventListener("mousemove", handleMouseMove as any);
            element.removeEventListener("mouseleave", handleMouseLeave as any);
        };
    }, []);

    const Component = href ? "a" : "button";

    return (
        <Component
            ref={buttonRef as any}
            href={href}
            onClick={onClick}
            className={`inline-flex items-center justify-center transition-transform duration-100 ease-out ${className}`}
            style={{
                zIndex: 10,
                position: "relative",
            }}
        >
            {children}
        </Component>
    );
}
