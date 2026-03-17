import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function ThumbnailsPage() {
    return (
        <DocsLayout
            title="Thumbnail Generation"
            description="Create stunning, branded thumbnails for your blog posts automatically."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Thumbnails", href: "/docs/guides/thumbnails" }
            ]}
        >
            <h2 id="ai-thumbnails">AI-Powered Thumbnails</h2>
            <p>
                Recuvix can automatically generate a custom thumbnail for every blog post. These thumbnails are designed to match your brand's aesthetic and provide a high-quality visual for social sharing.
            </p>

            <h2 id="customization">Customization</h2>
            <p>
                You can customize the thumbnail generation by providing:
            </p>
            <ul>
                <li><strong>Style</strong>: Choose from various artistic styles (e.g., Minimalist, 3D Render, Cyberpunk).</li>
                <li><strong>Brand Colors</strong>: Use your workspace's primary colors in the generated artwork.</li>
                <li><strong>Text Overlay</strong>: Automatically add the blog title as a clean, legible overlay.</li>
            </ul>

            <Callout type="tip">
                Branded thumbnails significantly increase Click-Through Rate (CTR) when sharing your content on platform like X, LinkedIn, and Facebook.
            </Callout>
        </DocsLayout>
    );
}
