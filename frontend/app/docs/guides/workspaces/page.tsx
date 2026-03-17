import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function WorkspacesPage() {
    return (
        <DocsLayout
            title="Team Workspaces"
            description="Collaborate with your team or manage multiple client projects with isolated workspaces."
            breadcrumbs={[
                { label: "Platform", href: "/docs" },
                { label: "Team Workspaces", href: "/docs/guides/workspaces" }
            ]}
        >
            <h2 id="isolation">Project Isolation</h2>
            <p>
                Workspaces allow you to keep projects completely separate. Each workspace has its own:
            </p>
            <ul>
                <li>Blog history</li>
                <li>WordPress connections</li>
                <li>Brand assets & logos</li>
                <li>GSC tracking data</li>
            </ul>

            <h2 id="collaboration">Collaboration</h2>
            <p>
                Invite team members to your workspace with specific roles (Admin, Editor, Viewer). Perfect for agencies managing multiple client accounts.
            </p>

            <Callout type="info">
                Managed Mode credits can be shared across the entire workspace, making it easy to manage billing for a whole team.
            </Callout>
        </DocsLayout>
    );
}
