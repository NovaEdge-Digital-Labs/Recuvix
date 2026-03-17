import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function WordPressPage() {
    return (
        <DocsLayout
            title="WordPress Direct Publishing"
            description="Publish your generated blogs directly to your WordPress site in seconds."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "WordPress Publish", href: "/docs/guides/wordpress" }
            ]}
        >
            <h2 id="requirements">Requirements</h2>
            <ul>
                <li>WordPress version 5.6 or higher.</li>
                <li>Works with both Self-Hosted (WordPress.org) and Business/Creator plans on WordPress.com.</li>
            </ul>

            <h2 id="authentication">Authentication</h2>
            <p>
                Recuvix uses WordPress Application Passwords for secure communication. You do not need to share your main admin password.
            </p>

            <h2 id="setup">Setup Steps</h2>
            <ol>
                <li>Go to your WordPress Dashboard → Users → Profile.</li>
                <li>Scroll to **Application Passwords**.</li>
                <li>Enter 'Recuvix' as the app name and click **Add New**.</li>
                <li>Copy the generated 24-character password.</li>
                <li>In Recuvix settings, enter your Site URL, Username, and the Application Password.</li>
            </ol>

            <Callout type="info">
                Once connected, you can publish any blog as a 'Draft' or 'Published' post with a single click.
            </Callout>
        </DocsLayout>
    );
}
