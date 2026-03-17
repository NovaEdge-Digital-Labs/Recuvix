import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";

export default function BulkGenerationPage() {
    return (
        <DocsLayout
            title="Bulk Generation"
            description="Generate dozens of blog posts at once from a list of topics."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Bulk Generation", href: "/docs/guides/bulk-generation" }
            ]}
        >
            <h2 id="queuing">The Bulk Queue</h2>
            <p>
                The Bulk Generator allows you to paste a list of topics (one per line) and process them sequentially in the background.
            </p>

            <h2 id="persistence">Resilience & Persistence</h2>
            <p>
                Your bulk queue is saved to your browser's local storage. This means you can close your tab or lose your internet connection, and Recuvix will resume where it left off when you return.
            </p>

            <h2 id="export">Bulk Export</h2>
            <p>
                Once a bulk run is complete, you can download all blogs as a single ZIP package containing HTML, Markdown, or XML files.
            </p>
        </DocsLayout>
    );
}
