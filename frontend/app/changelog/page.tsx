import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import ChangelogEntry from '@/components/marketing/ChangelogEntry';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { getChangelogEntries } from '@/lib/marketing/data';

export const metadata: Metadata = {
    title: 'Changelog — Product Updates',
    description: 'Stay up to date with the latest features, improvements, and fixes to Recuvix. We release updates every two weeks to keep your SEO game strong.',
};

export default async function ChangelogPage() {
    const entries = await getChangelogEntries();

    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="CHANGELOG"
                title="PRODUCT"
                titleAccent="UPDATES."
                subtitle="The latest features, improvements, and fixes to Recuvix. Updated every two weeks."
            />

            <section className="changelog-container py-24 px-[max(40px,5vw)] max-w-4xl mx-auto">
                <div className="changelog-list">
                    {entries.length > 0 ? (
                        entries.map((entry, idx) => (
                            <ChangelogEntry
                                key={entry.id}
                                version={entry.version}
                                date={new Date(entry.date).toLocaleDateString()}
                                type={entry.type as any}
                                title={entry.title}
                                image={entry.image_url || undefined}
                                isNew={entry.is_new}
                                changes={entry.changes as any}
                            />
                        ))
                    ) : (
                        <div className="text-center py-24 border border-white/5 rounded-3xl bg-zinc-900/10">
                            <p className="text-zinc-600 font-outfit">No updates found. We're busy building!</p>
                        </div>
                    )}
                </div>

                <div className="changelog-footer mt-20 text-center border-t border-white/5 pt-20">
                    <h3 className="font-bebas text-3xl text-white mb-4">Never miss an update</h3>
                    <p className="text-zinc-500 mb-8 font-outfit">Join 2,000+ SEO experts staying ahead of the curve.</p>
                    <div className="flex justify-center gap-4">
                        <a href="https://x.com/recuvix" className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors">
                            <span>🐦</span> Follow on X
                        </a>
                        <a href="/newsletter" className="px-6 py-3 bg-[#e8ff47] text-black rounded-lg font-bold hover:opacity-90 transition-opacity">
                            Subscribe to Insider
                        </a>
                    </div>
                </div>
            </section>

            <LandingFooter />

        </main>
    );
}
