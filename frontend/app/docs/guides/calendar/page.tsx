import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function CalendarPage() {
    return (
        <DocsLayout
            title="Content Calendar"
            description="Plan, schedule, and automate your content strategy with a visual calendar."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Content Calendar", href: "/docs/guides/calendar" }
            ]}
        >
            <h2 id="overview">Overview</h2>
            <p>
                The Content Calendar provides a visual bird's-eye view of your publishing schedule. It helps you stay consistent and ensures your content strategy is balanced.
            </p>

            <h2 id="features">Key Features</h2>
            <ul>
                <li><strong>Drag-and-Drop Scheduling</strong>: Easily move blog posts between dates.</li>
                <li><strong>AI Topic Suggestions</strong>: Get seasonal and trending topic ideas directly on your calendar.</li>
                <li><strong>Status Tracking</strong>: See at a glance what's scheduled, in progress, or published.</li>
                <li><strong>Multi-Channel View</strong>: Manage content for multiple blogs or WordPress sites in one place.</li>
            </ul>

            <Callout type="info">
                Consistency is key to SEO success. Using a calendar helps you maintain a steady publishing cadence.
            </Callout>
        </DocsLayout>
    );
}
