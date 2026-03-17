import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function RateLimitsPage() {
    return (
        <DocsLayout
            title="Rate Limits"
            description="Understand the usage limits for the Recuvix API and platform."
            breadcrumbs={[
                { label: "API Reference", href: "/docs/api/overview" },
                { label: "Rate Limits", href: "/docs/api/rate-limits" }
            ]}
        >
            <h2 id="overview">Overview</h2>
            <p>
                To ensure platform stability and fair usage for all users, we implement rate limits on our API endpoints and certain web features.
            </p>

            <h2 id="limits">Tiered Limits</h2>
            <div className="my-6 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Tier</th>
                            <th>Requests / min</th>
                            <th>Generations / day</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Free / BYOK</td>
                            <td>10</td>
                            <td>Unlimited (LLM key dependent)</td>
                        </tr>
                        <tr>
                            <td>Starter</td>
                            <td>20</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td>Pro / Agency</td>
                            <td>60+</td>
                            <td>500+</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Callout type="warning">
                Exceeding these limits will result in a <code>429 Too Many Requests</code> error. If you need higher limits, please contact our enterprise sales team.
            </Callout>
        </DocsLayout>
    );
}
