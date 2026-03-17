export function WhiteLabelTeaser() {
    return (
        <section id="whitelabel" className="relative py-32 bg-gradient-to-br from-[#050505] to-[#0a0a05] border-b border-white/[0.06] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">

                {/* Left Content */}
                <div className="flex-1 w-full lg:order-1 order-2">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                        FOR AGENCIES
                    </span>
                    <h2 className="font-['Bebas_Neue'] text-6xl md:text-[90px] leading-[0.85] text-white m-0 tracking-tight mb-8">
                        Resell Recuvix.<br />
                        Your brand.<br />
                        Your revenue.
                    </h2>

                    <div className="space-y-4 mb-10 max-w-md">
                        {[
                            { name: "Starter", price: "₹4,999/mo", limit: "50 users" },
                            { name: "Growth", price: "₹9,999/mo", limit: "200 users" },
                            { name: "Agency", price: "₹19,999/mo", limit: "500 users" },
                        ].map((plan, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#111111] border-l-2 border-[#e8ff47] rounded-r p-4 hover:bg-[#1a1a1a] transition-colors">
                                <div>
                                    <div className="text-white font-['Outfit'] font-semibold">{plan.name}</div>
                                    <div className="text-white/40 text-xs font-['JetBrains_Mono']">{plan.limit}</div>
                                </div>
                                <div className="text-[#a0a0a0] font-['Outfit'] font-medium">{plan.price}</div>
                            </div>
                        ))}
                    </div>

                    <button className="text-black bg-white font-['Bebas_Neue'] tracking-widest text-[18px] px-8 py-4 rounded shadow-lg hover:bg-[#e0e0e0] transition-colors relative overflow-hidden group">
                        <span className="relative z-10">Learn About White Label &rarr;</span>
                        <div className="absolute inset-0 bg-[#e8ff47] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                        <span className="absolute z-10 text-black hidden group-hover:inline-block transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full text-center">Learn About White Label &rarr;</span>
                    </button>
                </div>

                {/* Right Visual (Browser Mockup) */}
                <div className="flex-1 w-full lg:order-2 order-1 perspective-[1000px] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-600/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

                    <div
                        className="w-full aspect-[4/3] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-10"
                        style={{ transform: 'rotateY(-8deg) rotateX(4deg)' }}
                    >
                        {/* Fake Browser Toolbar */}
                        <div className="h-10 border-b border-white/10 bg-[#141414] flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            </div>
                            <div className="mx-auto w-1/2 bg-white/5 h-5 flex items-center justify-center rounded text-[10px] text-white/30 font-['JetBrains_Mono']">
                                app.youragency.com
                            </div>
                        </div>

                        {/* Fake App State - customized with purple */}
                        <div className="flex h-[calc(100%-2.5rem)]">
                            {/* Fake Sidebar */}
                            <div className="w-1/4 border-r border-white/5 p-4 flex flex-col gap-4">
                                {/* Custom Logo Mock */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded bg-purple-500"></div>
                                    <div className="h-3 w-16 bg-white/80 rounded"></div>
                                </div>
                                <div className="w-full h-2 bg-purple-500/80 rounded"></div>
                                <div className="w-3/4 h-2 bg-white/20 rounded"></div>
                                <div className="w-5/6 h-2 bg-white/20 rounded"></div>
                            </div>
                            {/* Fake Main Content */}
                            <div className="flex-1 p-6 relative">
                                <div className="w-1/3 h-6 bg-white/90 rounded mb-6"></div>
                                <div className="w-full h-8 bg-purple-500/10 border border-purple-500/30 rounded mb-4"></div>
                                <div className="w-full h-8 bg-white/5 rounded mb-4"></div>
                                <div className="w-full h-32 bg-white/5 rounded border border-white/10"></div>
                                <div className="absolute bottom-6 right-6 px-4 py-2 bg-purple-500 rounded text-[10px] text-white font-bold">GENERATE</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
