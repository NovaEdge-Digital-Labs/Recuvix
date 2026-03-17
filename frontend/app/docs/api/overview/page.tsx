import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { ArrowRight, Code, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ApiOverviewPage() {
    return (
        <div className="endpoint-page">
            <div className="endpoint-doc">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-bold font-syne text-[#f0f0f0]">API Reference</h1>
                    <p className="text-[#999] leading-relaxed max-w-xl text-lg">
                        The Recuvix API allows you to programmatically generate SEO-optimized content, track rankings, and manage workspaces.
                    </p>
                </div>

                <Callout type="warning">
                    The Recuvix public API is currently in beta. Endpoints and schemas may change as we stabilize the platform.
                </Callout>

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-4">Base URL</h2>
                    <p className="text-[#999] mb-4">All API requests should be made to our production base URL:</p>
                    <CodeBlock language="bash">
                        https://recuvix.in/api
                    </CodeBlock>
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-4">Authentication</h2>
                    <p className="text-[#999] mb-4">
                        Recuvix uses bearer token authentication. You can obtain your JWT from the Supabase session in the browser.
                    </p>
                    <Link href="/docs/api/authentication" className="inline-flex items-center gap-2 text-[#e8ff47] hover:underline font-medium">
                        Learn more about authentication <ArrowRight className="w-4 h-4" />
                    </Link>
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-4">Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FeatureItem
                            icon={<Zap className="w-4 h-4 text-[#e8ff47]" />}
                            title="Real-time Streaming"
                            desc="Get content as it's generated via Server-Sent Events."
                        />
                        <FeatureItem
                            icon={<Shield className="w-4 h-4 text-blue-500" />}
                            title="Secure BYOK"
                            desc="Your API keys never touch our database."
                        />
                        <FeatureItem
                            icon={<Code className="w-4 h-4 text-purple-500" />}
                            title="Developer Focused"
                            desc="Clean RESTful endpoints with comprehensive error codes."
                        />
                    </div>
                </section>
            </div>

            <div className="endpoint-playground">
                <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#111]">
                    <h3 className="text-lg font-bold text-[#f0f0f0] mb-4">Quick Start</h3>
                    <p className="text-[#666] text-sm mb-6">Test your authentication by fetching your current credit balance.</p>
                    <CodeBlock language="bash">
                        {`curl -X GET https://recuvix.in/api/credits/balance \\
  -H "Authorization: Bearer YOUR_TOKEN"`}
                    </CodeBlock>
                    <Link
                        href="/docs/api/endpoints/credits/balance"
                        className="w-full mt-6 py-3 rounded-lg bg-white/5 border border-[#111] text-[#f0f0f0] flex items-center justify-center gap-2 hover:bg-white/10 transition-colors text-sm font-medium"
                    >
                        View Endpoint Documentation
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-[#111]">
            <div className="flex items-center gap-3 mb-2">
                {icon}
                <span className="text-sm font-bold text-[#f0f0f0] tracking-tight">{title}</span>
            </div>
            <p className="text-xs text-[#666] leading-relaxed">{desc}</p>
        </div>
    );
}
