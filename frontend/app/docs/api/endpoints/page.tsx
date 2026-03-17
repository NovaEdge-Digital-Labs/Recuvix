import DocsLayout from "@/components/docs/DocsLayout";
import ApiEndpoint from "@/components/docs/ApiEndpoint";

export default function ApiEndpointsPage() {
    return (
        <DocsLayout
            title="API Endpoints"
            description="Detailed documentation for every available Recuvix API endpoint."
            breadcrumbs={[
                { label: "API Reference", href: "/docs/api/overview" },
                { label: "Endpoints", href: "/docs/api/endpoints" }
            ]}
        >
            <h2 id="blog">Blog Generation</h2>
            <div className="space-y-4">
                <ApiEndpoint
                    method="POST"
                    path="/blog/generate"
                    description="Generate a complete, SEO-optimized blog post."
                />
                <ApiEndpoint
                    method="POST"
                    path="/outline/generate"
                    description="Generate only the outline/structure of a blog."
                />
                <ApiEndpoint
                    method="POST"
                    path="/titles/suggest"
                    description="Get 5-10 AI-powered title suggestions for a topic."
                />
            </div>

            <h2 id="seo">SEO & Research</h2>
            <div className="space-y-4">
                <ApiEndpoint
                    method="POST"
                    path="/seo/meta"
                    description="Generate a complete SEO meta pack."
                />
                <ApiEndpoint
                    method="POST"
                    path="/research/topics"
                    description="Fetch keyword research and topic volume data."
                />
            </div>

            <h2 id="media">Media & Visuals</h2>
            <div className="space-y-4">
                <ApiEndpoint
                    method="POST"
                    path="/thumbnail/generate"
                    description="Create a branded thumbnail image."
                />
                <ApiEndpoint
                    method="POST"
                    path="/images/stock"
                    description="Search and fetch relevant stock images."
                />
            </div>
        </DocsLayout>
    );
}
