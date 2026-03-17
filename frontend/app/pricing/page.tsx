import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import PricingCard from '@/components/marketing/PricingCard';
import PricingFAQ from '@/components/marketing/PricingFAQ';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
    title: 'Pricing — Simple Credit-Based Plans',
    description: 'Choose the perfect credit pack for your SEO needs. BYOK mode or Managed mode - scaling your content has never been easier.',
};

const PricingPage = () => {
    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="PRICING"
                title="CREDITS. NOT"
                titleAccent="SUBSCRIPTIONS."
                subtitle="Buy once. Use whenever. Never expires. Refunded automatically if generation fails."
            />

            {/* BYOK Banner */}
            <section className="px-[max(40px,5vw)] py-12">
                <div className="bg-[#e8ff47]/5 border border-[#e8ff47]/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">🔑</span>
                        <div>
                            <h3 className="font-bebas text-2xl text-white mb-2">BYOK — Always Free</h3>
                            <p className="text-zinc-500 max-w-lg text-sm">
                                Use your own Claude, ChatGPT, Gemini, or Grok API key. Recuvix is completely free in BYOK mode.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-2">
                            {['🤖', '🧠', '✨', '⚡'].map((icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center grayscale opacity-50">{icon}</div>
                            ))}
                        </div>
                        <span className="font-mono text-[10px] text-[#e8ff47] border border-[#e8ff47]/30 px-3 py-1 rounded-full">FREE FOREVER</span>
                    </div>
                </div>
            </section>

            {/* Credit Packs */}
            <section className="px-[max(40px,5vw)] py-20 text-center">
                <h2 className="font-playfair italic text-3xl text-white mb-2">Credit Packs for Managed Mode</h2>
                <p className="text-zinc-500 mb-16">No API key needed. We provide the AI.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    <PricingCard
                        credits={10}
                        label="blogs"
                        price="499"
                        perBlog="₹49.90 per blog"
                        features={[
                            "HTML + Markdown + XML output",
                            "SEO meta pack included",
                            "AI thumbnail included",
                            "Stock images included",
                            "12 languages"
                        ]}
                        ctaLabel="Get Started"
                    />
                    <PricingCard
                        popular
                        credits={50}
                        label="blogs"
                        price="1,999"
                        perBlog="₹39.98 per blog"
                        savings="SAVE 20%"
                        features={[
                            "HTML + Markdown + XML output",
                            "SEO meta pack included",
                            "AI thumbnail included",
                            "Stock images included",
                            "12 languages",
                            "Priority queue"
                        ]}
                        ctaLabel="Get Pro Pack"
                    />
                    <PricingCard
                        credits={200}
                        label="blogs"
                        price="5,999"
                        perBlog="₹29.99 per blog"
                        savings="SAVE 40%"
                        features={[
                            "HTML + Markdown + XML output",
                            "SEO meta pack included",
                            "AI thumbnail included",
                            "Stock images included",
                            "12 languages",
                            "Bulk generation"
                        ]}
                        ctaLabel="Get Agency Pack"
                    />
                    <PricingCard
                        credits={500}
                        label="blogs"
                        price="11,999"
                        perBlog="₹23.99 per blog"
                        savings="SAVE 52%"
                        features={[
                            "Everything in Agency",
                            "Priority support",
                            "API access",
                            "Custom branding",
                            "Dedicated account manager"
                        ]}
                        ctaLabel="Get Mega Pack"
                    />
                </div>
            </section>

            {/* Refund Policy */}
            <section className="px-[max(40px,5vw)] pb-20">
                <div className="bg-[#e8ff47]/5 border border-[#e8ff47]/15 rounded-xl p-10 max-w-4xl mx-auto text-center">
                    <div className="text-4xl mb-4">🔄</div>
                    <h3 className="font-bebas text-3xl text-white mb-4">Credit Refund Guarantee</h3>
                    <p className="text-zinc-500 line-clamp-2">
                        If blog generation fails for any reason caused by our system, 1 credit is automatically refunded to your balance within 60 seconds. No support ticket. No waiting.
                    </p>
                </div>
            </section>

            {/* White Label Preview */}
            <section className="px-[max(40px,5vw)] py-20 bg-zinc-950/20 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-bebas text-4xl text-white mb-12 text-center">For Agencies: White Label Plans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-xl">
                            <h4 className="font-mono text-xs text-zinc-500 mb-2 uppercase">Starter Agency</h4>
                            <div className="text-3xl font-bebas text-white mb-4">₹4,999<span className="text-sm font-outfit text-zinc-600">/mo</span></div>
                            <ul className="space-y-3 text-sm text-zinc-500 mb-8 font-outfit">
                                <li>• 50 users, 5 workspaces</li>
                                <li>• Your domain, your brand</li>
                                <li>• 15% revenue share</li>
                                <li>• Basic features</li>
                            </ul>
                            <button className="w-full py-3 border border-white/10 hover:border-[#e8ff47]/50 text-white rounded-lg transition-colors font-bebas tracking-wider">CHOOSE STARTER</button>
                        </div>
                        <div className="p-8 bg-zinc-900/50 border border-[#e8ff47]/20 rounded-xl relative scale-105">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#e8ff47] text-black font-bebas text-xs rounded-full">RECOMMENDED</div>
                            <h4 className="font-mono text-xs text-[#e8ff47] mb-2 uppercase">Growth Agency</h4>
                            <div className="text-3xl font-bebas text-white mb-4">₹9,999<span className="text-sm font-outfit text-zinc-600">/mo</span></div>
                            <ul className="space-y-3 text-sm text-zinc-300 mb-8 font-outfit">
                                <li>• 200 users, 20 workspaces</li>
                                <li>• All features included</li>
                                <li>• 20% revenue share</li>
                                <li>• Email support</li>
                            </ul>
                            <button className="w-full py-3 bg-[#e8ff47] text-black rounded-lg font-bebas tracking-wider">CHOOSE GROWTH</button>
                        </div>
                        <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-xl">
                            <h4 className="font-mono text-xs text-zinc-500 mb-2 uppercase">Agency Pro</h4>
                            <div className="text-3xl font-bebas text-white mb-4">₹19,999<span className="text-sm font-outfit text-zinc-600">/mo</span></div>
                            <ul className="space-y-3 text-sm text-zinc-500 mb-8 font-outfit">
                                <li>• 500 users, 50 workspaces</li>
                                <li>• All features included</li>
                                <li>• 25% revenue share</li>
                                <li>• Priority support</li>
                            </ul>
                            <button className="w-full py-3 border border-white/10 hover:border-[#e8ff47]/50 text-white rounded-lg transition-colors font-bebas tracking-wider">CHOOSE PRO</button>
                        </div>
                    </div>
                    <div className="mt-12 text-center">
                        <p className="text-zinc-600 text-sm mb-4">Need even more? Enterprises get unlimited everything.</p>
                        <a href="/contact" className="text-[#e8ff47] font-bebas text-lg border-b border-[#e8ff47]/30 hover:border-[#e8ff47] transition-all pb-1 tracking-wider">TALK TO SALES →</a>
                    </div>
                </div>
            </section>

            <PricingFAQ />

            <LandingFooter />

        </main>
    );
};

export default PricingPage;
