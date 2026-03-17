import Link from 'next/link';
import DocsLayout from '@/components/docs/DocsLayout';
import { PenTool, Target, Layers, Zap } from 'lucide-react';

export default function DocsOverviewPage() {
    return (
        <DocsLayout
            title="Welcome to Recuvix Docs"
            description="Recuvix is an AI-powered SEO blog generation platform. This documentation covers everything from quick setup to advanced white-label configuration."
        >
            <div className="space-y-12">
                <section>
                    <h2>What you can do with Recuvix</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <FeatureCard
                            icon={<PenTool className="w-5 h-5 text-[#e8ff47]" />}
                            title="Generate Blogs"
                            description="Create high-quality, long-form SEO blog posts in seconds."
                        />
                        <FeatureCard
                            icon={<Target className="w-5 h-5 text-cyan-500" />}
                            title="Track Rankings"
                            description="Monitor your GSC performance and keyword rankings."
                        />
                        <FeatureCard
                            icon={<Layers className="w-5 h-5 text-purple-500" />}
                            title="Repurpose Content"
                            description="Turn audio or existing blogs into fresh content."
                        />
                        <FeatureCard
                            icon={<Zap className="w-5 h-5 text-orange-500" />}
                            title="Build Agency Tools"
                            description="White-label Recuvix for your own clients and team."
                        />
                    </div>
                </section>

                <section>
                    <h2>Choose your path</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <PathCard
                            title="I'm a blogger"
                            description="Learn how to generate SEO content for your site."
                            cta="Quickstart guide"
                            href="/docs/quickstart"
                        />
                        <PathCard
                            title="I'm an agency"
                            description="Set up workspaces and white-labeling for clients."
                            cta="Team workspaces"
                            href="/docs/guides/workspaces"
                        />
                        <PathCard
                            title="I'm a developer"
                            description="Integrate Recuvix directly via our REST API."
                            cta="API reference"
                            href="/docs/api/overview"
                        />
                    </div>
                </section>
            </div>
        </DocsLayout>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-xl bg-[#0d0d0d] border border-[#111] hover:border-[#222] transition-colors group">
            <div className="p-2 w-fit rounded-lg bg-white/[0.03] mb-4 group-hover:bg-white/[0.05] transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-[#f0f0f0] mb-2">{title}</h3>
            <p className="text-sm text-[#666] leading-relaxed">{description}</p>
        </div>
    );
}

function PathCard({ title, description, cta, href }: { title: string, description: string, cta: string, href: string }) {
    return (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-[#111] flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-[#f0f0f0] mb-3">{title}</h3>
            <p className="text-sm text-[#666] mb-6 leading-relaxed">
                {description}
            </p>
            <Link
                href={href}
                className="mt-auto px-6 py-2 rounded-full border border-[#222] text-sm text-[#f0f0f0] hover:bg-[#e8ff47] hover:text-black hover:border-transparent transition-all font-medium"
            >
                {cta}
            </Link>
        </div>
    );
}
