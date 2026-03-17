import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function RepurposingPage() {
    return (
        <DocsLayout
            title="Blog Repurposing"
            description="Turn your existing content into multiple SEO-optimized articles."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Blog Repurposing", href: "/docs/guides/repurposing" }
            ]}
        >
            <h2 id="overview">What is Repurposing?</h2>
            <p>
                Repurposing allows you to take high-performing content from one format and transform it into several blog posts. This maximizes your content's ROI and keeps your blog fresh with minimal effort.
            </p>

            <h2 id="sources">Input Sources</h2>
            <ul>
                <li><strong>YouTube Videos</strong>: Turn a single video into a series of how-to guides.</li>
                <li><strong>Podcast Audio</strong>: Transform spoken interviews into long-form thought leadership pieces.</li>
                <li><strong>Existing Blog URLs</strong>: Update old content or split long articles into a series.</li>
                <li><strong>Social Media Threads</strong>: Expand your best performing X (Twitter) threads into full articles.</li>
            </ul>

            <Callout type="info">
                Repurposing helps you maintain a consistent publishing schedule without having to research new topics from scratch every time.
            </Callout>
        </DocsLayout>
    );
}
