import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function ManagedModePage() {
    return (
        <DocsLayout
            title="Managed Mode"
            description="Use Recuvix credits for fully managed AI blog generation without needing your own API keys."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Managed Mode", href: "/docs/guides/managed-mode" }
            ]}
        >
            <h2 id="overview">Overview</h2>
            <p>
                Managed Mode is the simplest way to use Recuvix. Instead of providing your own API keys, you use Recuvix's high-performance AI infrastructure powered by credits.
            </p>

            <h2 id="benefits">Benefits of Managed Mode</h2>
            <ul>
                <li><strong>No setup required</strong>: Skip the hassle of creating API accounts at Anthropic or OpenAI.</li>
                <li><strong>High reliability</strong>: Use our enterprise-grade infrastructure with higher rate limits.</li>
                <li><strong>Predictable pricing</strong>: Pay only for what you use with straightforward credit pricing.</li>
            </ul>

            <h2 id="credits">Credit Usage</h2>
            <p>1 Credit = 1 Complete SEO Blog Package, which includes:</p>
            <ul>
                <li>Full blog generation (3000+ words if needed)</li>
                <li>SEO Meta Pack (Title, Desc, Slug)</li>
                <li>3-5 High-quality images</li>
                <li>Branded thumbnail</li>
            </ul>
        </DocsLayout>
    );
}
