'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
    return (
        <div className="flex min-h-screen w-full bg-[#050505]" {...props}>
            {/* Left Brand Panel (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-950 items-center justify-center overflow-hidden border-r border-white/5">
                {/* Abstract Orbs with Floating Animation */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        scale: [1, 1.05, 1],
                        opacity: [0.6, 0.8, 0.6],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"
                />

                {/* Dotted grid background */}
                <div className="absolute inset-0 opacity-[0.15]" style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }} />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15,
                                delayChildren: 0.2
                            }
                        }
                    }}
                    className="relative z-10 w-full max-w-xl p-16 space-y-12"
                >
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium backdrop-blur-sm shadow-xl"
                    >
                        <Sparkles className="w-4 h-4 text-accent" />
                        Next-Gen SEO Engine
                    </motion.div>

                    <motion.h1
                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                        className="text-6xl font-['Bebas_Neue'] tracking-widest text-white leading-[1.1]"
                    >
                        SCALE YOUR CONTENT.<br />
                        <span className="text-accent">
                            OWN YOUR RANKING.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                        className="text-xl text-zinc-400 font-medium leading-relaxed max-w-md font-outfit"
                    >
                        The fully autonomous blogging engine built for agencies, founders, and scaling brands. Generate massive topical authority.
                    </motion.p>

                    <motion.div
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                        className="space-y-6 pt-6"
                    >
                        {[
                            'Zero markup on AI API usage (BYOK - Bring Your Own Keys)',
                            'Automated WordPress network publishing',
                            'Intelligent multi-lingual keyword clustering'
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
                                className="flex items-center gap-4 text-zinc-300 font-medium font-outfit"
                            >
                                <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </span>
                                {feature}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[#050505]">
                {/* Mobile ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    className={cn("relative z-10 w-full max-w-[420px] bg-zinc-950/50 lg:bg-transparent p-8 lg:p-0 rounded-3xl lg:rounded-none border lg:border-none border-white/5 shadow-2xl lg:shadow-none backdrop-blur-xl lg:backdrop-blur-none", className)}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
