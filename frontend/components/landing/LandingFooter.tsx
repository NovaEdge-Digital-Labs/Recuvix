'use client';
import Link from "next/link";

export function LandingFooter() {
    return (
        <footer className="bg-[#050505] text-[#f0f0f0] pt-24 pb-12 border-t border-white/[0.06] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">

                    {/* Column 1 - Brand */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-1">
                            <span className="font-['Bebas_Neue'] text-3xl tracking-wide text-[#e8ff47]">RECU</span>
                            <span className="font-['Bebas_Neue'] text-3xl tracking-wide text-white">VIX</span>
                        </Link>
                        <p className="font-['Outfit'] text-[#a0a0a0] leading-relaxed">
                            Write once. Rank everywhere.<br />
                            The AI content platform for serious creators and agencies.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <a href="https://www.youtube.com/@novaedgedigitallabs" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center hover:bg-[#e8ff47] hover:text-black hover:border-[#e8ff47] transition-all">
                                <span className="sr-only">Twitter</span>
                                𝕏
                            </a>
                            <a href="https://www.linkedin.com/company/novaedgedigitallabs/" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center hover:bg-[#e8ff47] hover:text-black hover:border-[#e8ff47] transition-all">
                                <span className="sr-only">LinkedIn</span>
                                in
                            </a>
                            <a href="https://www.instagram.com/novaedgedigitallabs/" className="w-10 h-10 rounded border border-white/10 flex items-center justify-center hover:bg-[#e8ff47] hover:text-black hover:border-[#e8ff47] transition-all">
                                <span className="sr-only">Instagram</span>
                                ig
                            </a>
                        </div>
                    </div>

                    {/* Column 2 - Product */}
                    <div>
                        <h4 className="font-['JetBrains_Mono'] text-sm tracking-widest font-bold text-white mb-6 uppercase">Product</h4>
                        <ul className="space-y-4 font-['Outfit'] text-[#a0a0a0]">
                            <li><Link href="/features" className="hover:text-[#e8ff47] transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-[#e8ff47] transition-colors">Pricing</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-[#e8ff47] transition-colors">How it Works</Link></li>
                            <li><Link href="/white-label" className="hover:text-[#e8ff47] transition-colors">White Label</Link></li>
                            <li><Link href="/blog" className="hover:text-[#e8ff47] transition-colors">Blog</Link></li>
                            <li><Link href="/changelog" className="hover:text-[#e8ff47] transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 - Use Cases */}
                    <div>
                        <h4 className="font-['JetBrains_Mono'] text-sm tracking-widest font-bold text-white mb-6 uppercase">Use Cases</h4>
                        <ul className="space-y-4 font-['Outfit'] text-[#a0a0a0]">
                            <li><Link href="/use-cases/bloggers" className="hover:text-[#e8ff47] transition-colors">For Bloggers</Link></li>
                            <li><Link href="/use-cases/agencies" className="hover:text-[#e8ff47] transition-colors">For Agencies</Link></li>
                            <li><Link href="/use-cases/ecommerce" className="hover:text-[#e8ff47] transition-colors">For eCommerce</Link></li>
                            <li><Link href="/use-cases/coaches" className="hover:text-[#e8ff47] transition-colors">For Coaches</Link></li>
                            <li><Link href="/use-cases/podcasters" className="hover:text-[#e8ff47] transition-colors">For Podcasters</Link></li>
                            <li><Link href="/voice" className="hover:text-[#e8ff47] transition-colors">Voice to Blog</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 - Resources */}
                    <div>
                        <h4 className="font-['JetBrains_Mono'] text-sm tracking-widest font-bold text-white mb-6 uppercase">Resources</h4>
                        <ul className="space-y-4 font-['Outfit'] text-[#a0a0a0]">
                            <li><Link href="/docs" className="hover:text-[#e8ff47] transition-colors">Documentation</Link></li>
                            <li><Link href="/docs/api/overview" className="hover:text-[#e8ff47] transition-colors">API Reference</Link></li>
                            <li><Link href="/status" className="hover:text-[#e8ff47] transition-colors flex items-center gap-2">Status <span className="w-2 h-2 rounded-full bg-green-500 block"></span></Link></li>
                            <li><Link href="/privacy" className="hover:text-[#e8ff47] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[#e8ff47] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="hover:text-[#e8ff47] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-['Outfit'] text-[#666666]">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <div>© {new Date().getFullYear()} Recuvix. All rights reserved.</div>
                        <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
                        <div>Recuvix Technologies, India</div>
                    </div>
                    <div className="flex items-center gap-2">
                        Built with <span className="text-[#e8ff47]">❤</span> in India 🇮🇳
                    </div>
                </div>

            </div>

            {/* Decorative Text */}
            <div className="absolute -bottom-[5vw] left-0 right-0 z-0 pointer-events-none select-none overflow-hidden flex justify-center">
                <span className="font-['Bebas_Neue'] text-[25vw] text-transparent leading-none opacity-[0.02]" style={{ WebkitTextStroke: '2px rgba(255,255,255,1)' }}>
                    RECUVIX
                </span>
            </div>
        </footer>
    );
}

export default LandingFooter;
