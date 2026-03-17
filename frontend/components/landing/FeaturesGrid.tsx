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
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
}

export function FeaturesGrid() {
    return (
        <section id="features" className="py-32 bg-[#050505] border-b border-white/[0.06] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                        WHAT YOU GET
                    </span>
                    <h2 className="font-['Bebas_Neue'] text-6xl md:text-[100px] leading-[0.85] text-white m-0 tracking-tight">
                        Everything a content<br />
                        team needs.
                    </h2>
                    <p className="font-['Playfair_Display'] italic text-2xl md:text-3xl text-[#a0a0a0] mt-6 max-w-2xl">
                        Not a basic writer. A complete content intelligence platform.
                    </p>
                </motion.div>

                {/* CSS Bento Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-12 auto-rows-[240px] gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >

                    {/* LARGE CARD: AI Blog Generation (8 cols, 2 rows) */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-8 md:row-span-2 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 hover:shadow-[0_0_30px_rgba(232,255,71,0.05)] transition-all duration-300 p-8 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10 w-full md:w-1/2">
                            <h3 className="font-['Outfit'] text-2xl font-semibold text-white mb-3">AI Blog Generation</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed mb-6">
                                Generate fully structured, 2,000+ word articles with proper headings, lists, and formatting.
                            </p>
                            <div className="flex gap-4 mt-auto">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="text-[10px] text-[#e8ff47] font-['JetBrains_Mono'] mb-1">WORD COUNT</div>
                                    <div className="text-xl font-['Bebas_Neue'] text-white">2,481</div>
                                </div>
                                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="text-[10px] text-[#e8ff47] font-['JetBrains_Mono'] mb-1">SEO SCORE</div>
                                    <div className="text-xl font-['Bebas_Neue'] text-white">96/100</div>
                                </div>
                            </div>
                        </div>

                        {/* Visual: Live Blog Mock */}
                        <div className="absolute right-[-10%] md:right-[-5%] bottom-[-20%] w-[80%] md:w-[60%] h-[120%] bg-[#111111] border border-white/10 rounded-t-xl overflow-hidden group-hover:-translate-y-6 transition-transform duration-700 flex flex-col items-center shadow-2xl">
                            {/* Fake browser bar */}
                            <div className="w-full h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                                </div>
                                <div className="mx-auto w-2/3 bg-black/40 h-5 rounded flex items-center px-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
                                    <div className="text-[9px] text-white/30 font-['JetBrains_Mono']">app.recuvix.ai/editor</div>
                                </div>
                            </div>
                            <div className="p-8 w-full opacity-40 overflow-hidden relative">
                                <div className="animate-blog-scroll">
                                    <div className="w-3/4 h-8 bg-white/20 rounded mb-6"></div>
                                    <div className="w-full h-3 bg-white/10 rounded mb-10"></div>
                                    <div className="w-full aspect-video bg-white/5 rounded-lg mb-8 flex items-center justify-center border border-white/10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/10"></div>
                                        <div className="font-['Bebas_Neue'] text-2xl text-white/10 tracking-widest">HERO IMAGE</div>
                                    </div>
                                    <div className="w-1/2 h-5 bg-[#e8ff47]/20 rounded mb-4 border-l-2 border-[#e8ff47]"></div>
                                    <div className="space-y-3">
                                        <div className="w-full h-2.5 bg-white/5 rounded"></div>
                                        <div className="w-[90%] h-2.5 bg-white/5 rounded"></div>
                                        <div className="w-[85%] h-2.5 bg-white/5 rounded"></div>
                                    </div>
                                </div>
                                {/* Scanning Line Overlay */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e8ff47]/60 shadow-[0_0_15px_#e8ff47] animate-scan-line z-20"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* MEDIUM CARD: 12 Languages (4 cols, 1 row) */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-4 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 transition-all p-6 flex flex-col justify-between overflow-hidden relative group"
                    >
                        <div className="relative z-10">
                            <h3 className="font-['Outfit'] text-xl font-semibold text-white mb-2">12 Languages</h3>
                            <p className="text-[#a0a0a0] text-xs leading-relaxed">
                                Natively written, localized content. Not a translation.
                            </p>
                        </div>

                        {/* Interactive Language Ring */}
                        <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 border border-[#e8ff47]/10 rounded-full flex items-center justify-center animate-spin-slow group-hover:border-[#e8ff47]/30 transition-colors">
                            <div className="absolute top-0 text-lg">🇮🇳</div>
                            <div className="absolute right-0 text-lg">🇪🇸</div>
                            <div className="absolute bottom-0 text-lg">🇫🇷</div>
                            <div className="absolute left-0 text-lg">🇩🇪</div>
                        </div>
                        <div className="relative z-10 font-['Bebas_Neue'] text-4xl text-white/10 mt-auto group-hover:text-[#e8ff47]/20 transition-colors">GLOBAL</div>
                    </motion.div>

                    {/* MEDIUM CARD: SEO Meta Pack (4 cols, 1 row) */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-4 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 transition-all p-6 flex flex-col justify-between overflow-hidden group relative"
                    >
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-['Outfit'] text-xl font-semibold text-white">SEO Meta Pack</h3>
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-[#e8ff47] animate-bounce"></div>
                                    <div className="w-1 h-3 bg-[#e8ff47] animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-3 bg-[#e8ff47] animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                            <p className="text-[#a0a0a0] text-xs leading-relaxed mb-4">
                                Full schema, hreflang, and Open Graph tags.
                            </p>
                        </div>
                        <div className="font-['JetBrains_Mono'] text-[10px] text-white/50 bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden group-hover:border-[#e8ff47]/20 transition-all">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#e8ff47]/20"></div>
                            <code className="block">
                                <span className="text-pink-400">"schema"</span>: {`{`} <br />
                                &nbsp;&nbsp;<span className="text-blue-300">"@type"</span>: <span className="text-green-300">"Article"</span>,<br />
                                &nbsp;&nbsp;<span className="text-blue-300">"author"</span>: <span className="text-green-300">"Expert"</span><br />
                                {`}`}
                            </code>
                        </div>
                    </motion.div>

                    {/* MEDIUM CARD: AI Thumbnail (4 cols, 1 row) */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 flex flex-col md:col-span-4 overflow-hidden relative group p-6"
                    >
                        <div className="absolute inset-0 z-0 group-hover:scale-110 transition-transform duration-700">
                            {/* Mock Thumbnail Visual */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-black z-10"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-40 h-24 border-2 border-white/20 rounded-lg backdrop-blur-sm relative overflow-hidden flex items-center justify-center">
                                    <div className="text-[10px] font-['Bebas_Neue'] text-white/40 tracking-[0.3em]">RECU_THUMB-01</div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="w-2/3 h-full bg-[#e8ff47]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-20 flex flex-col justify-between h-full">
                            <h3 className="font-['Outfit'] text-xl font-semibold text-white mb-2 shadow-black drop-shadow-md">AI Thumbnail</h3>
                            <p className="text-[#e0e0e0] text-xs leading-relaxed drop-shadow-md font-medium">
                                Cinematic assets tailored to your topic.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[9px] text-[#e8ff47] border border-white/10 uppercase font-['JetBrains_Mono'] tracking-widest">4K UHD</span>
                                <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded text-[9px] text-white/60 border border-white/10 uppercase font-['JetBrains_Mono'] tracking-widest">16:9</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* SMALL CARD: Voice to Blog (3 cols) */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-3 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 p-6 flex flex-col justify-between group overflow-hidden relative"
                    >
                        <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-[#e8ff47]/5 blur-3xl rounded-full"></div>
                        <div className="flex gap-1.5 items-end h-12 mb-6 relative z-10">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className={`flex-1 bg-[#e8ff47]/40 rounded-t group-hover:animate-wave-intense`}
                                    style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 0.1}s` }}></div>
                            ))}
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-['Outfit'] text-lg font-semibold text-white mb-1">Voice to Blog</h3>
                            <p className="text-[#a0a0a0] text-[11px] leading-relaxed">
                                Record ideas. We format them into ranked articles.
                            </p>
                        </div>
                    </motion.div>

                    {/* Competitor Analyser */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-3 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 p-6 flex flex-col justify-between group overflow-hidden relative"
                    >
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-4/5 bg-red-500 animate-pulse"></div>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-full bg-green-500"></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-['Outfit'] text-lg font-semibold text-white mb-1">Competitor Analyser</h3>
                            <p className="text-[#a0a0a0] text-[11px] leading-relaxed">
                                Analyse any URL and outrank it with better structure.
                            </p>
                        </div>
                    </motion.div>

                    {/* Content Calendar */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-3 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 p-6 flex flex-col justify-between group overflow-hidden relative"
                    >
                        <div className="grid grid-cols-4 gap-1 opacity-20 group-hover:opacity-40 transition-opacity mb-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className={`aspect-square border border-white/20 rounded-sm ${i === 4 || i === 9 ? 'bg-[#e8ff47]/50' : ''}`}></div>
                            ))}
                        </div>
                        <div>
                            <h3 className="font-['Outfit'] text-lg font-semibold text-white mb-1">Content Calendar</h3>
                            <p className="text-[#a0a0a0] text-[11px] leading-relaxed">
                                Plan, schedule, and automate your entire blog roadmap.
                            </p>
                        </div>
                    </motion.div>

                    {/* Internal Linking */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-3 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 p-6 flex flex-col justify-between group overflow-hidden relative"
                    >
                        <div className="relative h-12 mb-4">
                            <div className="absolute left-0 top-1/2 w-4 h-4 border border-[#e8ff47] rounded-full"></div>
                            <div className="absolute right-0 top-1/2 w-4 h-4 bg-[#e8ff47] rounded-md"></div>
                            <div className="absolute left-4 right-4 top-1/2 h-[1px] bg-gradient-to-r from-[#e8ff47] to-transparent animate-shimmer"></div>
                        </div>
                        <div>
                            <h3 className="font-['Outfit'] text-lg font-semibold text-white mb-1">Internal Linking</h3>
                            <p className="text-[#a0a0a0] text-[11px] leading-relaxed">
                                Auto-generate semantic links to your existing posts.
                            </p>
                        </div>
                    </motion.div>

                    {/* Blog Repurposing (Wide) */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-6 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 p-8 flex flex-col md:flex-row gap-8 group overflow-hidden relative items-center"
                    >
                        <div className="flex-1">
                            <h3 className="font-['Outfit'] text-xl font-semibold text-white mb-2">Omnichannel Engine</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed mb-4">
                                One blog becomes a LinkedIn post, a Twitter thread, and a YouTube script. Automatically.
                            </p>
                            <div className="flex gap-4">
                                <span className="text-white/40 text-sm">𝕏</span>
                                <span className="text-white/40 text-sm">in</span>
                                <span className="text-white/40 text-sm">yt</span>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center relative scale-110">
                            <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center group-hover:border-[#e8ff47]/40 transition-colors animate-spin-slow">
                                <div className="w-20 h-20 border border-[#e8ff47]/20 rounded-full flex items-center justify-center">
                                    <span className="text-xl rotate-[-20deg]">♻️</span>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-radial-gradient from-[#e8ff47]/5 to-transparent blur-xl"></div>
                        </div>
                    </motion.div>

                    {/* WordPress Publish */}
                    <motion.div
                        variants={cardVariants}
                        className="bento-card md:col-span-6 bg-[#0d0d0d] rounded-xl border border-white/[0.06] hover:border-[#e8ff47]/30 p-8 flex flex-col md:flex-row gap-8 group overflow-hidden relative items-center"
                    >
                        <div className="flex-1 flex justify-center scale-125">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
                                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-3xl font-bold text-white/40">W</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-['Outfit'] text-xl font-semibold text-white mb-2">One-Click Deploy</h3>
                            <p className="text-[#a0a0a0] text-sm leading-relaxed">
                                Direct integration with WP, Ghost, and Substack. Go live in seconds.
                            </p>
                        </div>
                    </motion.div>

                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes blogScroll {
          0% { transform: translateY(0); }
          50% { transform: translateY(-40%); }
          100% { transform: translateY(0); }
        }
        .animate-blog-scroll {
          animation: blogScroll 20s ease-in-out infinite;
        }
        @keyframes waveIntense {
          0%, 100% { height: 30%; opacity: 0.4; }
          50% { height: 100%; opacity: 1; }
        }
        .animate-wave-intense {
          animation: waveIntense 0.8s ease-in-out infinite;
        }
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(300px); }
        }
        .animate-scan-line {
          animation: scan 4s linear infinite;
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }
        @keyframes shimmerLine {
           0% { left: -100%; }
           100% { left: 100%; }
        }
        .animate-shimmer {
           animation: shimmerLine 2s infinite linear;
        }
      `}} />
        </section>
    );
}
