import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import NewsletterForm from '@/components/marketing/NewsletterForm';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
    title: 'Newsletter | The SEO Insider by Recuvix',
    description: 'Join 3,200+ readers getting weekly actionable SEO tactics and AI content prompts. Stay ahead of the search algorithms.',
};

export default function NewsletterPage() {
    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="THE INSIDER"
                title="SEO OPS"
                titleAccent="NEWSLETTER."
                subtitle="The same strategies we use to rank Recuvix, delivered to your inbox every Tuesday. No fluff, just tactics."
            />

            <NewsletterForm />

            <section className="pb-32 px-[max(40px,5vw)] max-w-6xl mx-auto">
                <h3 className="font-bebas text-3xl text-white mb-12 text-center">What's inside every issue?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "The Search Update", desc: "A 2-minute summary of the latest Google core updates and what they mean for India." },
                        { title: "AI Prompt Bank", desc: "Copy-pasteable prompts to generate better outlines, intros, and SEO tags." },
                        { title: "Creator Spotlight", desc: "A breakdown of a site that's crushing it with AI content right now." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl">
                            <div className="text-[#e8ff47] font-mono text-[10px] mb-4">ISSUE SECTION {i + 1}</div>
                            <h4 className="font-syne font-bold text-white text-lg mb-3">{item.title}</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <LandingFooter />

        </main>
    );
}
