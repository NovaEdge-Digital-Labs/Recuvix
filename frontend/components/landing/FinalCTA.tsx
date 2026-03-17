"use client";

import { motion } from "framer-motion";
import { ThreeCanvas } from "./ThreeCanvas";
import { MagneticButton } from "./MagneticButton";
import Link from "next/link";

export function FinalCTA() {
    return (
        <section className="relative min-h-[70vh] py-32 bg-[#050505] flex items-center overflow-hidden">

            {/* 3D Icosahedron Background */}
            <div id="final-cta-scene" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-0 opacity-50 pointer-events-none">
                <ThreeCanvas sceneType="icosahedron" triggerSelector="#final-cta-scene" />
            </div>

            <motion.div
                className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >

                <h2 className="font-['Bebas_Neue'] text-[100px] md:text-[180px] leading-[0.85] text-white m-0 tracking-tight flex flex-col items-center group cursor-default">
                    <span className="block hover:-translate-y-2 transition-transform duration-300">START</span>
                    <span className="block text-white" style={{ textShadow: '0 0 60px rgba(232,255,71,0.4)' }}>
                        GENERATING.
                    </span>
                </h2>

                <p className="font-['Playfair_Display'] italic text-2xl md:text-4xl text-[#a0a0a0] mt-8 max-w-2xl mx-auto mb-12">
                    Your first blog. Free. Right now.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 w-full max-w-2xl">
                    <MagneticButton href="/signup" className="w-full sm:w-auto text-black bg-[#e8ff47] font-['Bebas_Neue'] tracking-widest text-[20px] px-10 py-5 rounded-[4px] shadow-[0_0_40px_rgba(232,255,71,0.25)] hover:bg-[#d4ed36]">
                        Generate Free with My API Key &rarr;
                    </MagneticButton>

                    <span className="font-['Playfair_Display'] italic text-[#666666]">or</span>

                    <MagneticButton href="/signup?plan=starter" className="w-full sm:w-auto text-white bg-transparent border border-white/20 font-['Bebas_Neue'] tracking-widest text-[20px] px-10 py-5 rounded-[4px] hover:bg-white/5 transition-colors">
                        Buy 10 Credits — ₹499
                    </MagneticButton>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-['Outfit'] text-[#888888]">
                    <span className="flex items-center gap-1.5"><span className="text-[#a0a0a0]">🔒</span> No card required</span>
                    <span className="hidden md:block text-[#444]">·</span>
                    <span className="flex items-center gap-1.5"><span className="text-[#a0a0a0]">⚡</span> Ready in 60 seconds</span>
                    <span className="hidden md:block text-[#444]">·</span>
                    <span className="flex items-center gap-1.5"><span className="text-[#a0a0a0]">🔄</span> Credits never expire</span>
                    <span className="hidden md:block text-[#444]">·</span>
                    <span className="flex items-center gap-1.5"><span className="text-[#a0a0a0]">🌍</span> 12 languages</span>
                </div>

            </motion.div>
        </section>
    );
}
