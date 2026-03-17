export function Testimonials() {
    const testimonials = [
        {
            quote: "I used to spend 6 hours writing one blog. Now I do it in 8 minutes. The SEO pack alone is worth it.",
            author: "Rahul Sharma",
            role: "Digital Marketing Agency, Mumbai",
            package: "Pro Pack User"
        },
        {
            quote: "The multilingual feature is incredible. We target 5 GCC countries and Recuvix writes natively in Arabic and English perfectly.",
            author: "Sarah Jenkins",
            role: "E-Commerce Director, Dubai",
            package: "Agency Pack User"
        },
        {
            quote: "We connected it straight to our WordPress. The formatting comes out flawless every single time. Best tool I've bought this year.",
            author: "Karan Patel",
            role: "Tech Blogger, Bangalore",
            package: "Starter Pack User"
        }
    ];

    return (
        <section className="py-32 bg-[#050505] border-b border-white/[0.06] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                <div className="text-center md:text-left mb-16 flex flex-col items-center md:items-start">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                        FROM THE COMMUNITY
                    </span>
                    <h2 className="font-['Playfair_Display'] italic text-5xl md:text-[64px] leading-tight text-white m-0">
                        What creators say.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className={`bg-[#0d0d0d] border border-white/[0.06] rounded-xl p-8 relative flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300`}>
                            {/* Giant decorative quote mark */}
                            <div className="absolute top-4 left-6 font-['Playfair_Display'] text-[80px] text-[#e8ff47] opacity-20 leading-none select-none pointer-events-none">
                                "
                            </div>

                            <div className="relative z-10 mb-8 pt-4">
                                <p className="text-[#d0d0d0] font-['Outfit'] text-lg leading-relaxed italic">
                                    {t.quote}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-white/10 shrink-0">
                                    <span className="font-['Outfit'] font-bold text-white/50">{t.author.charAt(0)}</span>
                                </div>
                                <div>
                                    <div className="font-['Outfit'] font-semibold text-white tracking-wide">{t.author}</div>
                                    <div className="text-[#a0a0a0] text-xs font-medium">{t.role}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[#e8ff47] text-xs tracking-widest">★★★★★</span>
                                        <span className="text-white/30 text-[10px] uppercase font-['JetBrains_Mono'] tracking-wider">{t.package}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a href="/signup" className="inline-flex items-center gap-2 text-white font-['Outfit'] font-medium group hover:text-[#e8ff47] transition-colors">
                        Join 2,400+ creators
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                </div>

            </div>
        </section>
    );
}
