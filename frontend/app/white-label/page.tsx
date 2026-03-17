import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import WLPlanCard from '@/components/marketing/WLPlanCard';
import RevenueCalculator from '@/components/marketing/RevenueCalculator';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
    title: 'White Label Agency Portal',
    description: 'Empower your agency with our White Label portal. Resell AI SEO audits and content under your own brand with custom margins.',
};

const WhiteLabelPage = () => {
    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="FOR AGENCIES"
                title="YOUR BRAND."
                titleAccent="YOUR REVENUE."
                subtitle="Launch a fully-branded AI blog generation platform for your clients. Your logo, your domain, your pricing — in under 30 minutes."
                cta={{
                    primary: { label: "Talk to Sales →", href: "/contact" },
                    secondary: { label: "View Plans", href: "#plans" }
                }}
            />

            {/* What is White Label? */}
            <section className="px-[max(40px,5vw)] py-24 flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1">
                    <h2 className="font-playfair italic text-4xl text-white mb-8">Your clients never see Recuvix.</h2>
                    <div className="space-y-6 text-zinc-500 leading-relaxed font-outfit">
                        <p>
                            White Label lets your agency offer AI blog generation under your own brand. Your clients visit blogtool.youragency.com, see your logo, and pay your prices.
                        </p>
                        <p>
                            You set the markup. You earn the revenue. We handle the infrastructure, AI keys, servers, and updates.
                        </p>
                        <p>
                            It takes 30 minutes to set up and zero technical knowledge to run.
                        </p>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#e8ff47] to-[#00d4ff] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl p-4 w-[500px] h-[300px] overflow-hidden shadow-2xl [transform:perspective(1000px)_rotateY(-10deg)]">
                            <div className="h-6 bg-zinc-900 border-b border-white/5 flex items-center px-4 gap-1.5 mb-4">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-[#00d4ff] flex items-center justify-center font-bold text-white">Y</div>
                                    <div className="h-4 bg-zinc-800 rounded w-24" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-8 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded w-3/4" />
                                    <div className="h-4 bg-zinc-800 rounded w-full" />
                                    <div className="h-4 bg-zinc-800 rounded w-5/6" />
                                    <div className="h-10 bg-[#00d4ff] rounded w-32 mt-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (Agency Steps) */}
            <section className="px-[max(40px,5vw)] py-20 bg-zinc-950/20 border-y border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl">💳</div>
                        <h3 className="font-bebas text-2xl text-white">STEP 1: Purchase Licence</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Choose a white label plan on our pricing page. Within 24 hours, your branded subdomain is live at agency-slug.recuvix.in.</p>
                    </div>
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl">🎨</div>
                        <h3 className="font-bebas text-2xl text-white">STEP 2: Configure Your Brand</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Upload your logo, choose brand colors, set your custom domain, write your tagline. All from a no-code dashboard.</p>
                    </div>
                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl">👥</div>
                        <h3 className="font-bebas text-2xl text-white">STEP 3: Invite Your Clients</h3>
                        <p className="text-zinc-500 text-sm leading-relaxed">Share your custom URL. Your clients sign up, buy credits at your prices, and generate blogs — never knowing Recuvix exists.</p>
                    </div>
                </div>
            </section>

            {/* Everything You Control */}
            <section className="px-[max(40px,5vw)] py-24">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: "🌐", title: "Custom Domain", desc: "Use your own domain via CNAME. SSL provisioned automatically." },
                        { icon: "🎨", title: "Full Branding", desc: "Logo, favicon, colors, fonts, tagline. Live preview as you configure." },
                        { icon: "💰", title: "Your Pricing", desc: "Set your own credit pack prices. Markup platform prices by any %." },
                        { icon: "📊", label: "REVENUE", title: "Revenue Sharing", desc: "Earn 15-30% of every credit purchase. Monthly payouts via Razorpay." },
                        { icon: "🔧", label: "CONTROL", title: "Feature Flags", desc: "Enable or disable any feature for your clients. Show only what's relevant." },
                        { icon: "👥", label: "ADMIN", title: "User Management", desc: "Full user list, suspend accounts, view usage stats, export data." }
                    ].map((feat, i) => (
                        <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 rounded-xl space-y-4">
                            <div className="text-2xl">{feat.icon}</div>
                            <h3 className="font-syne font-bold text-lg text-white">{feat.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <RevenueCalculator />

            {/* Plans Section */}
            <section id="plans" className="px-[max(40px,5vw)] py-24">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                    <WLPlanCard
                        name="Starter"
                        price="₹4,999"
                        users="50"
                        workspaces="5"
                        domain="Your subdomain"
                        revShare="15%"
                        features={["Custom Logo & Colors", "Basic Support", "Standard Features"]}
                        ctaLabel="GET STARTED"
                    />
                    <WLPlanCard
                        featured
                        name="Growth"
                        price="₹9,999"
                        users="200"
                        workspaces="20"
                        domain="Custom domain + SSL"
                        revShare="20%"
                        features={["All Standard Features", "Priority Support", "Feature Flags"]}
                        ctaLabel="START GROWTH"
                    />
                    <WLPlanCard
                        name="Agency"
                        price="₹19,999"
                        users="500"
                        workspaces="50"
                        domain="Custom domain + SSL"
                        revShare="25%"
                        features={["All Features", "Dedicated Account Manager", "White-glove setup"]}
                        ctaLabel="START AGENCY"
                    />
                </div>
            </section>

            {/* FAQ */}
            <section className="px-[max(40px,5vw)] py-24 border-t border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-bebas text-4xl text-white mb-16 text-center">Common Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                        {[
                            { q: "How quickly can I launch?", a: "Subdomain is provisioned within 24 hours. Custom domain takes 24-48 hours (DNS propagation). Brand configuration is instant." },
                            { q: "Do my clients know it's built on Recuvix?", a: "No. There is no Recuvix branding visible to your clients. The \"Powered by Recuvix\" footer link is optional and off by default." },
                            { q: "Can I set my own credit prices?", a: "Yes. You can mark up platform prices by any percentage. You set the price, we process the payment, you earn the share." },
                            { q: "What happens if I cancel?", a: "With 30 days notice, your instance is deactivated. All user data is exported to you first." }
                        ].map((faq, i) => (
                            <div key={i} className="space-y-3">
                                <h4 className="font-syne font-bold text-white underline decoration-[#e8ff47]/30 decoration-2 underline-offset-4">{faq.q}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 bg-zinc-950/40 text-center">
                <h2 className="font-bebas text-6xl md:text-8xl text-white mb-8">Ready to launch Your platform?</h2>
                <p className="text-zinc-500 mb-12 text-lg">30 minutes to go live. Zero technical knowledge required.</p>
                <div className="flex justify-center gap-6">
                    <a href="/contact" className="btn-primary">Talk to Sales →</a>
                </div>
            </section>

            <LandingFooter />

        </main>
    );
};

export default WhiteLabelPage;
