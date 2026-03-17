import DocsLayout from "@/components/docs/DocsLayout";

export default function ConceptsPage() {
    return (
        <DocsLayout
            title="Core Concepts"
            description="Understand the underlying technology and philosophy behind Recuvix."
            breadcrumbs={[
                { label: "Getting Started", href: "/docs" },
                { label: "Core Concepts", href: "/docs/concepts" }
            ]}
        >
            <h2 id="seo-first">SEO-First Architecture</h2>
            <p>
                Unlike generic AI writers, Recuvix is built from the ground up for search engine performance. We combine real-time SERP data with advanced LLMs to ensure every piece of content has a strategic purpose.
            </p>

            <h2 id="privacy-by-design">Privacy by Design</h2>
            <p>
                We believe you should control your own data. That's why our BYOK (Bring Your Own Key) mode ensures your API keys never touch our servers—they stay securely in your browser's local storage.
            </p>

            <h2 id="credits-vs-key">Credits vs. API Keys</h2>
            <p>
                Recuvix offers flexibility in how you power your generations. Use <strong>API Keys</strong> for maximum cost-efficiency if you are a power user, or <strong>Credits</strong> for a seamless, managed experience.
            </p>
        </DocsLayout>
    );
}
