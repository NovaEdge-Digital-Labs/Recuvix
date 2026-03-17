import DocsLayout from '@/components/docs/DocsLayout';
import Callout from '@/components/docs/Callout';
import StepList from '@/components/docs/StepList';
import Step from '@/components/docs/Step';
import CodeBlock from '@/components/docs/CodeBlock';

export default function QuickstartPage() {
    return (
        <DocsLayout
            title="5-Minute Quickstart"
            description="Start generating high-quality SEO content with Recuvix in minutes. This guide walks you through setting up your account and generating your first blog."
        >
            <Callout type="tip">
                You can start generating blogs for free using your own API key. No credit card required to get started.
            </Callout>

            <section className="mt-12">
                <h2>Follow these steps</h2>

                <StepList>
                    <Step number={1} title="Create your account">
                        <p>
                            Go to <a href="https://recuvix.in/signup" target="_blank">recuvix.in/signup</a> and create a free account using your email or Google. After signing up, you'll be redirected to the onboarding flow.
                        </p>
                    </Step>

                    <Step number={2} title="Add your API key">
                        <p>
                            Navigate to the Onboarding or Settings page. Select your preferred AI model provider and paste your API key.
                        </p>
                        <CodeBlock language="text">
                            {`Claude key format:   sk-ant-api03-...
OpenAI key format:   sk-proj-...
Gemini key format:   AIzaSy...
Grok key format:     xai-...`}
                        </CodeBlock>
                        <Callout type="info">
                            Your API key is stored only in your browser's localStorage. Recuvix never stores or transmits your key to our servers.
                        </Callout>
                    </Step>

                    <Step number={3} title="Generate your first blog">
                        <p>
                            Go to the Dashboard, enter a topic you want to write about, select your target country, and click <strong>Generate Blog</strong>. Recuvix will research the topic and create a complete SEO meta pack and blog structure first.
                        </p>
                    </Step>

                    <Step number={4} title="Download or publish">
                        <p>
                            Once generation is complete, you can review the blog. Download it as <strong>HTML, Markdown, or XML</strong>, or publish it directly to your WordPress site with a single click.
                        </p>
                    </Step>
                </StepList>
            </section>

            <section className="mt-12">
                <h2>Next steps</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <LinkBox
                        title="BYOK Guide"
                        href="/docs/guides/byok"
                        description="Learn more about bringing your own key."
                    />
                    <LinkBox
                        title="Managed Mode"
                        href="/docs/guides/managed-mode"
                        description="Use our credits instead of your own key."
                    />
                </div>
            </section>
        </DocsLayout>
    );
}

function LinkBox({ title, href, description }: { title: string, href: string, description: string }) {
    return (
        <Link href={href} className="block p-4 rounded-lg bg-[#0d0d0d] border border-[#111] hover:border-[#222] transition-colors">
            <h4 className="font-bold text-[#f0f0f0] mb-1">{title}</h4>
            <p className="text-xs text-[#666]">{description}</p>
        </Link>
    );
}

import Link from 'next/link';
