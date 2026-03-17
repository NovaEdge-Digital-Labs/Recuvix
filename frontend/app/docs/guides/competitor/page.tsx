import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function CompetitorPage() {
    return (
        <DocsLayout
            title="Competitor Analyser"
            description="Reverse engineer your competitors' SEO strategy and outrank them."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Competitor Analyser", href: "/docs/guides/competitor" }
            ]}
        >
            <h2 id="overview">Overview</h2>
            <p>
                The Competitor Analyser allows you to input any URL and get a detailed breakdown of their SEO structure, keyword usage, and content strategy.
            </p>

            <h2 id="features">Key Features</h2>
            <ul>
                <li><strong>URL Scraping</strong>: Automatically extract content and meta data from any public URL.</li>
                <li><strong>Content Breakdown</strong>: See the exact H1-H6 structure and word count of a competitor's page.</li>
                <li><strong>Keyword Extraction</strong>: Identify the primary and secondary keywords your competitor is targeting.</li>
                <li><strong>Gap Analysis</strong>: Compare your content against theirs to find missing opportunities.</li>
            </ul>

            <Callout type="tip">
                Use the Competitor Analyser before generating a new blog to ensure you're covering all the key points your competitors have, but better.
            </Callout>
        </DocsLayout>
    );
}
