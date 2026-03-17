export function LogoStrip() {
    const logos = [
        "CREATIVE LABS", "DIGITAL INDUS", "SOCIAL SENSE", "MEDIA WIZARDS",
        "CONTENT FLOW", "MARKET MINDS", "TECH TAMIL", "BANGALORE BOTS",
        "PUNE PIXELS", "DELHI DESIGNS", "HYDERABAD HUB", "MUMBAI MOTIONS"
    ];

    return (
        <section className="w-full h-[80px] bg-white/[0.02] border-y border-white/[0.06] overflow-hidden flex items-center relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

            <div className="flex items-center gap-12 whitespace-nowrap px-4 animate-marquee group">
                {/* Double the array to create infinite scroll effect */}
                {[...logos, ...logos, ...logos].map((logo, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                        <span className="font-['Bebas_Neue'] text-xl tracking-widest text-[#f0f0f0]/30 transition-all duration-300 group-hover/item:text-[#e8ff47] group-hover/item:scale-110">
                            {logo}
                        </span>
                        <span className="text-[#e8ff47]/20 text-xs">◆</span>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
        </section>
    );
}
