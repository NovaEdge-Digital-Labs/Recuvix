import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function InternalLinkingPage() {
    return (
        <DocsLayout
            title="Internal Linking"
            description="Automatically build a powerful internal link structure for your blog."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Internal Linking", href: "/docs/guides/internal-linking" }
            ]}
        >
            <h2 id="overview">Why Internal Linking?</h2>
            <p>
                Internal links help Google discover new pages on your site and pass 'link juice' to your most important content. Recuvix automates this process by suggesting relevant links based on your content history.
            </p>

            <h2 id="how-it-works">How it works</h2>
            <ol>
                <li><strong>Content Scan</strong>: Recuvix scans your workspace's blog history.</li>
                <li><strong>Contextual Matching</strong>: Our AI identifies natural opportunities to link between related articles.</li>
                <li><strong>Suggestion Engine</strong>: You get a list of suggested internal links that you can approve or reject.</li>
                <li><strong>Auto-Insertion</strong>: Approved links are automatically injected into your new blog post.</li>
            </ol>

            <Callout type="tip">
                Proper internal linking can improve your average session duration and reduce bounce rate by guiding users to related content.
            </Callout>
        </DocsLayout>
    );
}
