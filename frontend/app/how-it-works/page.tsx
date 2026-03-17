import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import StepCard from '@/components/marketing/StepCard';
import IncludedGrid from '@/components/marketing/IncludedGrid';
import ModeComparison from '@/components/marketing/ModeComparison';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
    title: 'How It Works — The Recuvix Content Engine',
    description: 'Learn how Recuvix transforms a single keyword or voice note into a fully optimized, 2,000-word SEO blog post in minutes.',
};

const HowItWorksPage = () => {
    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="THE PROCESS"
                title="THREE STEPS."
                titleAccent="ONE BLOG."
                subtitle="From blank page to published, SEO-ready blog in under 3 minutes. Here's exactly how."
            />

            <div className="steps-wrapper py-20">
                <StepCard
                    number="01"
                    icon="✍"
                    title="Choose Your Topic"
                    body="Type a topic, paste a title you have in mind, or import from your keyword research. Choose your target country, writing tone, word count (300-5000), and output format."
                    checklist={[
                        "Works with any niche and any country",
                        "Import topics from keyword research",
                        "Brand assets saved permanently",
                        "Generate outline first (optional)"
                    ]}
                    visual={
                        <div className="p-8 bg-[#0a0a0a]">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Blog Topic</div>
                                    <div className="p-3 bg-black border border-white/5 rounded text-sm text-zinc-300">Digital Marketing Tips for Indian Startups</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Country</div>
                                        <div className="p-3 bg-black border border-white/5 rounded text-sm text-zinc-400">🇮🇳 India</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Tone</div>
                                        <div className="p-3 bg-black border border-white/5 rounded text-sm text-zinc-400">Professional</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">Model</div>
                                    <div className="p-3 bg-black border border-[#e8ff47]/20 rounded text-sm text-[#e8ff47] flex items-center justify-between">
                                        Claude 3.5 Sonnet
                                        <span className="w-2 h-2 rounded-full bg-[#e8ff47] shadow-[0_0_10px_#e8ff47]" />
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-[#e8ff47] text-black font-bebas text-xl rounded shadow-[0_10px_30px_rgba(232,255,71,0.15)]">GENERATE BLOG →</button>
                            </div>
                        </div>
                    }
                />

                <StepCard
                    reversed
                    number="02"
                    icon="⚡"
                    title="AI Does Everything"
                    body="Your blog streams live — you watch every word being written. While generating, we also source relevant images, create a cinematic thumbnail, and build the full SEO meta pack."
                    checklist={[
                        "Real-time streaming generation",
                        "AI-powered image sourcing",
                        "Cinematic thumbnail creation",
                        "Full SEO meta pack building"
                    ]}
                    visual={
                        <div className="p-8 bg-[#0a0a0a]">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-[10px] text-[#e8ff47] font-mono">STEP 4/7: WRITING CONTENT...</div>
                                    <div className="text-[10px] text-zinc-600 font-mono">82%</div>
                                </div>
                                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#e8ff47] w-[82%] shadow-[0_0_10px_#e8ff47]" />
                                </div>
                                <div className="p-4 bg-black border border-white/5 rounded-lg h-48 overflow-hidden relative">
                                    <div className="space-y-3 opacity-60">
                                        <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                        <div className="h-4 bg-zinc-800 rounded w-full" />
                                        <div className="h-4 bg-zinc-800 rounded w-5/6" />
                                        <div className="h-4 bg-zinc-800 rounded w-2/3" />
                                        <div className="h-4 bg-zinc-800 rounded w-full" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <div className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-mono rounded">DONE: OUTLINE</div>
                                        <div className="px-2 py-1 bg-[#e8ff47]/10 border border-[#e8ff47]/20 text-[#e8ff47] text-[9px] font-mono rounded animate-pulse">WRITING...</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="aspect-square bg-zinc-900 border border-white/5 rounded flex items-center justify-center grayscale opacity-40 text-xs">IMG</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                />

                <StepCard
                    number="03"
                    icon="🚀"
                    title="Publish and Track"
                    body="Your blog is ready. Download all formats at once or publish directly to WordPress. Then track your rankings in Google Search Console — connected right inside Recuvix."
                    checklist={[
                        "One-click WordPress publishing",
                        "HTML, Markdown, XML exports",
                        "Google Search Console integration",
                        "Repurpose to 8 social platforms"
                    ]}
                    visual={
                        <div className="p-8 bg-[#0a0a0a]">
                            <div className="flex gap-4 h-full">
                                <div className="flex-1 space-y-4">
                                    <div className="aspect-video bg-zinc-900 rounded-lg border border-white/5 flex items-center justify-center text-zinc-700 text-xs font-mono">THUMBNAIL PREVIEW</div>
                                    <div className="h-32 bg-zinc-900/50 rounded-lg border border-white/5 p-4 space-y-2">
                                        <div className="h-2 bg-zinc-800 rounded w-1/2" />
                                        <div className="h-2 bg-zinc-800 rounded w-full" />
                                        <div className="h-2 bg-zinc-800 rounded w-full" />
                                    </div>
                                </div>
                                <div className="w-32 space-y-3">
                                    <div className="p-3 bg-[#e8ff47] text-black rounded text-[10px] font-bold text-center">PUBLISH TO WP</div>
                                    <div className="p-3 bg-white/5 border border-white/10 text-white rounded text-[10px] font-bold text-center">DOWNLOAD ZIP</div>
                                    <div className="p-3 bg-white/5 border border-white/10 text-white rounded text-[10px] font-bold text-center">REPURPOSE</div>
                                    <div className="pt-4 space-y-2">
                                        <div className="text-[8px] text-zinc-600 font-mono">RANK TRACKING</div>
                                        <div className="h-12 bg-white/5 rounded border border-white/5 flex items-end p-1 gap-[1px]">
                                            {[20, 40, 30, 60, 50, 80, 70, 90].map((h, i) => (
                                                <div key={i} className="flex-1 bg-[#e8ff47]/40 rounded-t-[1px]" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>

            <IncludedGrid />

            <ModeComparison />

            <section className="faq-section py-20 bg-zinc-950/20">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="font-bebas text-4xl text-white mb-12 text-center">Common Questions</h2>
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <h4 className="text-[#f0f0f0] font-syne font-semibold">How long does generation take?</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">60-180 seconds for a 1500-word blog including images, thumbnail, and SEO meta.</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[#f0f0f0] font-syne font-semibold">Can I edit the blog after generating?</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Yes. The in-app editor lets you edit any section or regenerate individual H2 sections with custom instructions.</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[#f0f0f0] font-syne font-semibold">Does it generate plagiarized content?</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">No. Every generation is unique. The AI writes original content each time. We do not copy from any source.</p>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[#f0f0f0] font-syne font-semibold">What if the blog is not what I expected?</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Use the Outline First feature to preview and approve the structure before full generation. Or regenerate any section individually.</p>
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />

        </main>
    );
};

export default HowItWorksPage;
