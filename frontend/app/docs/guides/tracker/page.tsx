import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function TrackerPage() {
    return (
        <DocsLayout
            title="GSC Tracker"
            description="Monitor your real-world search performance without leaving Recuvix."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "GSC Tracker", href: "/docs/guides/tracker" }
            ]}
        >
            <h2 id="overview">Google Search Console Integration</h2>
            <p>
                The GSC Tracker connects directly to your Google Search Console account to show you how your generated blogs are performing in the real world.
            </p>

            <h2 id="metrics">Monitored Metrics</h2>
            <ul>
                <li><strong>Impressions</strong>: Periodic tracking of how many times your pages appear in search results.</li>
                <li><strong>Clicks</strong>: Total clicks from Google search to your blog.</li>
                <li><strong>Average Position</strong>: Monitor individual keyword rankings over time.</li>
                <li><strong>CTR (Click-Through Rate)</strong>: Optimize your meta titles based on real performance data.</li>
            </ul>

            <Callout type="warning">
                You must connect your Google account and grant permission to view Search Console data for this feature to work.
            </Callout>
        </DocsLayout>
    );
}
