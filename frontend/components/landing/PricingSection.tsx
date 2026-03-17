"use client";

import { motion } from 'framer-motion'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        }
    }
}

const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6
        }
    }
}

export function PricingSection() {
    const plans = [
        {
            name: "STARTER",
            blogs: "10 Blogs",
            price: "₹499",
            perBlog: "₹49.90/blog",
            features: ["HTML + MD + XML format", "SEO meta tags generated", "AI Thumbnail generation"],
            highlight: false
        },
        {
            name: "PRO",
            badge: "MOST POPULAR",
            blogs: "50 Blogs",
            price: "₹1,999",
            perBlog: "₹39.98/blog",
            features: ["All Starter features", "Priority queue processing", "Save 20% compared to Starter"],
            highlight: true
        },
        {
            name: "AGENCY",
            blogs: "200 Blogs",
            price: "₹5,999",
            perBlog: "₹29.99/blog",
            features: ["All Pro features", "Bulk generation via CSV/UI", "Multilingual generation", "Save 40%"],
            highlight: false
        },
        {
            name: "MEGA",
            blogs: "500 Blogs",
            price: "₹11,999",
            perBlog: "₹23.99/blog",
            features: ["Everything in Agency", "Dedicated support channel", "Save 52%"],
            highlight: false
        }
    ];

    return (
        <section id="pricing" className="py-32 bg-[#0a0a0a] border-b border-white/[0.06] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#e8ff47]/10 to-transparent rounded-full blur-[200px] opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 w-full">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                        SIMPLE PRICING
                    </span>
                    <h2 className="font-['Bebas_Neue'] text-6xl md:text-[100px] leading-[0.85] text-white m-0 tracking-tight">
                        Credits. No subscriptions.<br />
                        No nonsense.
                    </h2>
                    <p className="font-['Playfair_Display'] italic text-2xl md:text-3xl text-[#a0a0a0] mt-6 max-w-2xl mx-auto">
                        Buy once. Use forever. Refunded automatically if generation fails.
                    </p>
                </motion.div>

                {/* Pricing Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            className={`w-full relative transition-transform duration-300 hover:scale-[1.02] hover:z-20
                ${plan.highlight ? 'z-10 lg:-translate-y-4' : 'z-0'}
               `}
                            style={{
                                perspective: '1000px',
                            }}
                        >
                            <div
                                className={`h-full flex flex-col p-8 rounded-xl border transition-all duration-300
                  ${plan.highlight
                                        ? 'bg-[#111] border-[#e8ff47]/50 shadow-[0_0_50px_rgba(232,255,71,0.15)]'
                                        : 'bg-[#050505] border-white/10 hover:border-white/30'
                                    }
                `}
                                style={{
                                    transform: 'rotateY(-2deg) rotateX(2deg)',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                {/* Popular Badge */}
                                {plan.badge && (
                                    <div className="absolute -top-4 right-4 bg-[#e8ff47] text-black font-['Bebas_Neue'] px-4 py-1 text-lg rounded -rotate-[8deg] shadow-lg border border-black/20">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <div className={`font-['JetBrains_Mono'] text-xs uppercase tracking-widest font-bold mb-4 ${plan.highlight ? 'text-[#e8ff47]' : 'text-white/50'}`}>
                                        {plan.name}
                                    </div>
                                    <h3 className="font-['Bebas_Neue'] text-5xl text-white mb-6 drop-shadow-md">
                                        {plan.blogs}
                                    </h3>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl font-bold font-['Outfit'] text-white tracking-tight">{plan.price}</span>
                                    </div>
                                    <div className="font-['JetBrains_Mono'] text-sm text-[#a0a0a0]">
                                        {plan.perBlog}
                                    </div>
                                </div>

                                <ul className="flex-1 space-y-4 mb-8">
                                    {plan.features.map((feat, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-[#d0d0d0] font-['Outfit']">
                                            <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${plan.highlight ? 'bg-[#e8ff47]/20 text-[#e8ff47]' : 'bg-white/10 text-white'}`}>✓</span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className={`w-full py-4 rounded font-['Bebas_Neue'] text-xl tracking-widest transition-colors
                    ${plan.highlight
                                            ? 'bg-[#e8ff47] text-black hover:bg-[#d4ed36]'
                                            : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30'
                                        }
                  `}
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Free Strip */}
                <motion.div
                    className="mt-16 bg-[#e8ff47]/[0.06] border border-[#e8ff47]/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6 max-w-4xl mx-auto backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div>
                        <div className="flex items-center gap-3 justify-center md:justify-start text-[#e8ff47] mb-2 font-['Outfit'] font-medium text-lg">
                            <span className="text-2xl">🔑</span> Using your own API key?
                        </div>
                        <p className="text-white/70 font-['Outfit']">
                            Recuvix is completely FREE in BYOK mode. Credits are only needed for managed (keyless) processing.
                        </p>
                    </div>
                    <button className="shrink-0 px-6 py-3 border border-white/20 text-white rounded hover:bg-white/5 font-['Outfit'] font-medium transition-colors">
                        Setup API Key &rarr;
                    </button>
                </motion.div>

            </div>
        </section>
    );
}
