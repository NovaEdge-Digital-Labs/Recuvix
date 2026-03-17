import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ContactForm } from '@/components/legal/ContactForm';
import { ChannelCard } from '@/components/legal/ChannelCard';
import { OfficeHours } from '@/components/legal/OfficeHours';
import { ContactFAQStrip } from '@/components/legal/ContactFAQStrip';

export const metadata = {
    title: 'Contact Us | Recuvix',
    description: 'Get in touch with the Recuvix team for support, billing, or general enquiries.',
};

export default function ContactPage() {
    return (
        <div className="bg-[#050505] min-h-screen text-[#f0f0f0] font-outfit">
            <LandingNav />

            <main className="max-w-[1200px] mx-auto px-[max(40px,5vw)] pt-[140px] pb-24">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Form */}
                    <div className="lg:w-[55%]">
                        <span className="font-mono text-[11px] text-[#e8ff47] uppercase tracking-[0.2em] block mb-4">
                            Get in touch
                        </span>
                        <h1 className="font-syne text-[clamp(40px,6vw,56px)] font-bold leading-[1.1] mb-4">
                            We actually read these.
                        </h1>
                        <p className="text-[#666] text-[17px] leading-[1.7] max-w-[500px]">
                            Average response time: under 4 hours on business days. We're building in public — your feedback shapes what we build next.
                        </p>

                        <ContactForm />
                    </div>

                    {/* Right Column: Support Grid */}
                    <div className="lg:w-[45%]">
                        <div className="mb-8">
                            <h2 className="font-syne text-[24px] font-bold text-[#f0f0f0] mb-2">Other ways to reach us</h2>
                            <p className="text-[#666] text-[15px]">Choose the fastest path to help.</p>
                        </div>

                        <div className="space-y-4">
                            <ChannelCard
                                icon="✉"
                                title="Email Support"
                                description="For billing, account issues, and detailed technical questions."
                                contact="support@recuvix.in"
                                badge="< 4 hours"
                                href="mailto:support@recuvix.in"
                            />
                            <ChannelCard
                                icon="📖"
                                title="Check the Docs"
                                description="Step-by-step guides for every feature. Most questions are answered here."
                                contact="recuvix.in/docs"
                                badge="Self-serve"
                                href="/docs"
                            />
                            <ChannelCard
                                icon="⚖"
                                title="Legal Enquiries"
                                description="Privacy requests, legal notices, data deletion, GDPR requests."
                                contact="legal@recuvix.in"
                                badge="5 business days"
                                href="mailto:legal@recuvix.in"
                            />
                            <ChannelCard
                                icon="🏢"
                                title="White Label & Enterprise"
                                description="Set up your agency's branded platform. Bulk pricing and custom contracts."
                                contact="enterprise@recuvix.in"
                                badge="Priority"
                                href="mailto:enterprise@recuvix.in"
                            />
                        </div>

                        <div className="mt-12">
                            <OfficeHours />
                        </div>
                    </div>
                </div>

                {/* Find us elsewhere */}
                <div className="mt-32">
                    <h2 className="font-syne text-[24px] font-bold text-[#f0f0f0] mb-8 text-center">Find us elsewhere</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <a href="https://twitter.com/recuvix" target="_blank" className="block p-6 bg-[#0a0a0a] border border-[#111] rounded-xl hover:border-[#e8ff47]/20 transition-all">
                            <h3 className="font-syne text-[18px] font-bold mb-2">Twitter / X</h3>
                            <p className="text-[#666] text-[14px] mb-4">Product updates, tips, and building in public</p>
                            <span className="text-[#e8ff47] text-[13px] font-semibold">Follow on X →</span>
                        </a>
                        <a href="https://linkedin.com/company/recuvix" target="_blank" className="block p-6 bg-[#0a0a0a] border border-[#111] rounded-xl hover:border-[#e8ff47]/20 transition-all">
                            <h3 className="font-syne text-[18px] font-bold mb-2">LinkedIn</h3>
                            <p className="text-[#666] text-[14px] mb-4">Company updates and case studies</p>
                            <span className="text-[#e8ff47] text-[13px] font-semibold">Follow on LinkedIn →</span>
                        </a>
                        <a href="https://discord.gg/recuvix" target="_blank" className="block p-6 bg-[#0a0a0a] border border-[#111] rounded-xl hover:border-[#e8ff47]/20 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-syne text-[18px] font-bold">Discord</h3>
                                <span className="text-[11px] bg-[#e8ff47]/10 text-[#e8ff47] px-2 py-0.5 rounded-full">247 members</span>
                            </div>
                            <p className="text-[#666] text-[14px] mb-4">Chat with the team and other users</p>
                            <span className="text-[#e8ff47] text-[13px] font-semibold">Join Discord →</span>
                        </a>
                    </div>
                </div>

                <ContactFAQStrip />
            </main>

            <LandingFooter />
        </div>
    );
}
