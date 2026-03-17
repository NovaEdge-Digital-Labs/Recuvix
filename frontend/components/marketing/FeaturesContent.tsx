'use client';

import React, { useState } from 'react';
import FeatureTabs from '@/components/marketing/FeatureTabs';
import FeatureGrid from '@/components/marketing/FeatureGrid';
import FeatureCard from '@/components/marketing/FeatureCard';

export default function FeaturesContent() {
    const [activeTab, setActiveTab] = useState('generation');

    const tabs = [
        { id: 'generation', label: '✍ Generation' },
        { id: 'seo', label: '📊 SEO & Research' },
        { id: 'tools', label: '🔧 Tools' },
        { id: 'platform', label: '🏢 Platform' },
    ];

    return (
        <section className="features-section py-20">
            <FeatureTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {activeTab === 'generation' && (
                <FeatureGrid>
                    <FeatureCard
                        colSpan={8}
                        rowSpan={2}
                        icon="✍"
                        title="AI Blog Generation"
                        subtitle="From topic to published blog in 3 minutes"
                        description="Enter any topic. Choose your country, tone, word count, and brand details. Get a complete, SEO-optimized blog with images, meta tags, and a thumbnail — all in one click."
                        badges={["HTML output", "Markdown", "WordPress XML", "Auto images", "SEO meta", "Thumbnails", "12 languages", "4 AI models"]}
                        visual={
                            <div className="generation-mock p-6 bg-[#0a0a0a] border border-white/10 rounded-xl mt-4 max-w-sm ml-auto">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-zinc-500 font-mono">TOPIC:</label>
                                        <div className="p-3 bg-black border border-white/5 rounded text-sm text-zinc-300">Digital Marketing for Startups</div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="space-y-2 flex-1">
                                            <label className="text-[10px] text-zinc-500 font-mono">COUNTRY:</label>
                                            <div className="p-2 bg-black border border-white/5 rounded text-sm text-zinc-400 flex items-center gap-2">🇮🇳 India</div>
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <label className="text-[10px] text-zinc-500 font-mono">TONE:</label>
                                            <div className="p-2 bg-black border border-white/5 rounded text-sm text-zinc-400">Professional</div>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 bg-[#e8ff47] text-black font-bebas text-lg rounded shadow-[0_0_20px_rgba(232,255,71,0.2)]">GENERATE BLOG →</button>
                                </div>
                            </div>
                        }
                    />
                    <FeatureCard
                        colSpan={4}
                        icon="🌐"
                        title="12 Languages"
                        description="Generate natively in Hindi, Spanish, French, German, Portuguese, Arabic, and more. Natively written, not translated."
                        visual={
                            <div className="grid grid-cols-3 gap-2 mt-4 opacity-50">
                                {['🇮🇳 HI', '🇺🇸 EN', '🇪🇸 ES', '🇫🇷 FR', '🇩🇪 DE', '🇸🇦 AR'].map(flag => (
                                    <div key={flag} className="p-2 bg-white/5 border border-white/5 rounded text-[10px] text-center">{flag}</div>
                                ))}
                            </div>
                        }
                    />
                    <FeatureCard
                        colSpan={4}
                        icon="🖼"
                        title="Cinematic Thumbnails"
                        description="Space-theme AI thumbnails generated from your brand colors and blog topic. Powered by Flux 1.1 Pro."
                        visual={
                            <div className="h-20 bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg mt-4 border border-white/5 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                            </div>
                        }
                    />
                    <FeatureCard
                        colSpan={4}
                        icon="🎙"
                        title="Voice to Blog"
                        description="Record or upload audio. Whisper AI transcribes it. LLM structures and writes the full SEO blog from your words."
                        visual={
                            <div className="flex items-center gap-1 mt-6 h-8 justify-center">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`w-1 bg-[#e8ff47] rounded-full animate-bounce h-${Math.floor(Math.random() * 6) + 2}`} style={{ animationDelay: `${i * 0.1}s` }} />
                                ))}
                            </div>
                        }
                    />
                    <FeatureCard
                        colSpan={4}
                        icon="⚡"
                        title="Bulk Generation"
                        description="Queue up to 50 topics. Generate overnight. Wake up to a full content library. CSV import supported."
                        visual={
                            <div className="space-y-2 mt-4 text-[10px] font-mono text-zinc-500">
                                <div className="flex items-center gap-2"><span className="text-green-500">✓</span> SEO for Restaurants</div>
                                <div className="flex items-center gap-2"><span className="text-green-500">✓</span> Digital Marketing Guide</div>
                                <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] animate-pulse" /> Content Strategy 2026</div>
                            </div>
                        }
                    />
                    <FeatureCard
                        colSpan={4}
                        icon="📋"
                        title="Outline First"
                        description="Review and edit the H1 + H2 structure before full generation. Approve the structure, then generate. No surprises."
                    />
                </FeatureGrid>
            )}

            {activeTab === 'seo' && (
                <FeatureGrid>
                    <FeatureCard
                        colSpan={8}
                        icon="🎯"
                        title="Complete SEO Meta Pack"
                        description="Every blog gets: meta title + desc, Open Graph tags, Twitter Cards, Article JSON-LD schema, hreflang tags, and a slug."
                        visual={
                            <div className="bg-[#050505] p-4 rounded-lg border border-white/5 mt-4 font-mono text-[10px] text-blue-400">
                                <div>{`<meta name="description" content="..." />`}</div>
                                <div className="text-green-400 mt-1">{`<meta property="og:title" content="..." />`}</div>
                                <div className="text-zinc-500 mt-1">{`<script type="application/ld+json">...</script>`}</div>
                            </div>
                        }
                    />
                    <FeatureCard colSpan={4} icon="🔍" title="Keyword Research" description="Enter a niche. Get 10-20 blog topic ideas with estimated search volume and content angle." />
                    <FeatureCard colSpan={4} icon="🕵" title="Competitor Analyser" description="Paste a competitor URL. We scrape their structure and headings to generate a superior brief." />
                    <FeatureCard colSpan={4} icon="📈" title="GSC Tracker" description="Connect Google Search Console. Track rankings, clicks, and impressions over time." />
                    <FeatureCard colSpan={4} icon="📅" title="Content Calendar" description="Plan 3-12 months of content. AI suggests topics based on seasonality and niche." />
                    <FeatureCard colSpan={4} icon="🔗" title="Internal Linking" description="Automatically find link opportunities across your blog library. Track your link graph." />
                </FeatureGrid>
            )}

            {activeTab === 'tools' && (
                <FeatureGrid>
                    <FeatureCard
                        colSpan={8}
                        icon="🔄"
                        title="Repurpose to 8 Platforms"
                        description="One blog → LinkedIn post, Twitter thread, newsletter, YouTube script, and more. All in one studio."
                        visual={
                            <div className="grid grid-cols-4 gap-4 mt-6">
                                {['X', 'In', 'Mail', 'YT', 'Insta', 'FB', 'WA', 'Pin'].map(p => (
                                    <div key={p} className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] text-zinc-500">{p}</div>
                                ))}
                            </div>
                        }
                    />
                    <FeatureCard colSpan={4} icon="W" title="WordPress Publish" description="Connect any site with Application Password. Publish as draft or live. No plugin required." />
                    <FeatureCard colSpan={4} icon="📦" title="3 Export Formats" description="Download as HTML, Markdown, or XML (WordPress WXR format)." />
                    <FeatureCard colSpan={4} icon="✏️" title="In-App Editor" description="Edit any section after generation. Regenerate individual H2 sections with custom instructions." />
                </FeatureGrid>
            )}

            {activeTab === 'platform' && (
                <FeatureGrid>
                    <FeatureCard
                        colSpan={8}
                        icon="👥"
                        title="Team Workspaces"
                        description="Agencies: create shared workspaces with roles. Shared credit pool, brand assets, and approval workflows."
                        visual={
                            <div className="flex -space-x-3 mt-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-xs">U{i}</div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#050505] bg-[#e8ff47] text-black flex items-center justify-center text-[10px] font-bold">+5</div>
                            </div>
                        }
                    />
                    <FeatureCard colSpan={4} icon="🔑" title="BYOK — Always Free" description="Use your own Claude, OpenAI, or Gemini key. Pay your provider directly. Recuvix charges nothing." />
                    <FeatureCard colSpan={4} icon="🏢" title="White Label" description="Run BlogForge under your brand on your domain. Your logo, your colors, your pricing." />
                    <FeatureCard colSpan={4} icon="💳" title="Credit System" description="Buy credits once. Use whenever. Never expire. Auto-refunded if generation fails." />
                </FeatureGrid>
            )}
        </section>
    );
}
