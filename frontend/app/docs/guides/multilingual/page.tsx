import DocsLayout from "@/components/docs/DocsLayout";

export default function MultilingualPage() {
    return (
        <DocsLayout
            title="Multilingual Blogs"
            description="Expand your reach with SEO blogs in 12+ international languages."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Multilingual", href: "/docs/guides/multilingual" }
            ]}
        >
            <h2 id="supported-languages">Supported Languages</h2>
            <p>Recuvix currently supports high-quality generation in the following languages:</p>
            <ul>
                <li>English (US/UK/AU/IN)</li>
                <li>Hindi</li>
                <li>Spanish</li>
                <li>French</li>
                <li>German</li>
                <li>Portuguese</li>
                <li>Arabic</li>
                <li>Japanese</li>
                <li>Chinese (Simplified)</li>
                <li>Korean</li>
                <li>Italian</li>
                <li>Russian</li>
            </ul>

            <h2 id="seo-localization">SEO Localization</h2>
            <p>
                When you select a language, Recuvix doesn't just translate—it localizes. It optimizes for local search trends, cultural nuances, and specific regional keywords.
            </p>
        </DocsLayout>
    );
}
