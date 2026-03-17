import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function WhiteLabelPage() {
    return (
        <DocsLayout
            title="White Label"
            description="Offer Recuvix's powerful AI blog generation under your own brand."
            breadcrumbs={[
                { label: "Platform", href: "/docs" },
                { label: "White Label", href: "/docs/guides/white-label" }
            ]}
        >
            <h2 id="overview">Agency Solutions</h2>
            <p>
                Our white-label feature is designed for agencies who want to offer AI content services to their clients without revealing Recuvix as the underlying platform.
            </p>

            <h2 id="customization">Customization Options</h2>
            <ul>
                <li><strong>Custom Domain</strong>: Run the platform on your own subdomain (e.g., content.youragency.com).</li>
                <li><strong>Custom Branding</strong>: Upload your own logo, set your brand colors, and customize the primary font.</li>
                <li><strong>Email White-labeling</strong>: Notifications and reports are sent from your agency email address.</li>
                <li><strong>Client Portals</strong>: Give your clients a clean, branded dashboard to review and approve content.</li>
            </ul>

            <Callout type="info">
                White Labeling is available on our Agency and Enterprise plans. Contact support for more details.
            </Callout>
        </DocsLayout>
    );
}
