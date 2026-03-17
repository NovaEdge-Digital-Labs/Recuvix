import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import FeaturesContent from '@/components/marketing/FeaturesContent';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
    title: 'Features — AI Content Intelligence Platform',
    description: 'Explore the powerful features of Recuvix. Bulk generation, 12 languages, AI SEO meta packs, and cinematic thumbnails for your blog.',
};

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="PLATFORM"
                title="EVERYTHING YOU NEED TO"
                titleAccent="RANK."
                subtitle="Not just a blog writer. A complete AI content intelligence platform. Every feature you need, nothing you don't."
                cta={{
                    primary: { label: "Start Free", href: "/signup" },
                    secondary: { label: "View Pricing", href: "/pricing" }
                }}
            />

            <FeaturesContent />

            <section className="cta-strip py-32 bg-[#050505] border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-5xl md:text-7xl font-bebas text-white mb-8">Ready to start generating?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/signup" className="btn-primary">Start Free with My API Key →</a>
                        <a href="/pricing" className="btn-secondary">View Pricing</a>
                    </div>
                </div>
            </section>

            <LandingFooter />

        </main>
    );
}
