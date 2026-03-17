import DocsLayout from "@/components/docs/DocsLayout";

export default function BillingPage() {
    return (
        <DocsLayout
            title="Credits & Billing"
            description="Manage your subscription, credits, and invoices."
            breadcrumbs={[
                { label: "Platform", href: "/docs" },
                { label: "Credits & Billing", href: "/docs/guides/billing" }
            ]}
        >
            <h2 id="credit-system">How Credits Work</h2>
            <p>
                Credits are used exclusively for <strong>Managed Mode</strong>. Each generation (Blog + Meta + Images + Thumbnail) consumes 1 credit.
            </p>

            <h2 id="no-expiration">No Expiration</h2>
            <p>
                Purchased credits never expire. Use them whenever you need, whether it's today or next year.
            </p>

            <h2 id="refunds">Automatic Refunds</h2>
            <p>
                If a generation fails for any reason, your credit is automatically refunded to your account within seconds.
            </p>

            <h2 id="payment-methods">Payment Methods</h2>
            <p>
                We support all major credit/debit cards, UPI, and net banking via our secure payment partners.
            </p>
        </DocsLayout>
    );
}
