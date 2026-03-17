import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";

export default function ApiErrorsPage() {
    return (
        <DocsLayout
            title="Error Codes"
            description="Understand and resolve common error codes returned by the Recuvix API."
            breadcrumbs={[
                { label: "API Reference", href: "/docs/api/overview" },
                { label: "Error Codes", href: "/docs/api/errors" }
            ]}
        >
            <h2 id="format">Error Format</h2>
            <p>All API errors follow a consistent JSON format:</p>
            <CodeBlock language="json">
                {`{
  "error": "Human readable message",
  "errorCode": "MACHINE_READABLE_CODE",
  "details": {} 
}`}
            </CodeBlock>

            <h2 id="http-status">HTTP Status Codes</h2>
            <div className="my-6 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Meaning</th>
                            <th>Common cause</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>400</td>
                            <td>Bad Request</td>
                            <td>Invalid input parameters</td>
                        </tr>
                        <tr>
                            <td>401</td>
                            <td>Unauthorized</td>
                            <td>Missing or invalid session token</td>
                        </tr>
                        <tr>
                            <td>402</td>
                            <td>Payment Required</td>
                            <td>Insufficient credits for task</td>
                        </tr>
                        <tr>
                            <td>429</td>
                            <td>Rate Limited</td>
                            <td>Too many requests</td>
                        </tr>
                        <tr>
                            <td>500</td>
                            <td>Server Error</td>
                            <td>Internal processing error</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="llm-errors">LLM Specific Errors</h2>
            <p>Errors specifically related to AI generation service providers:</p>
            <ul>
                <li><code>INVALID_API_KEY</code>: Your provided key is wrong or expired.</li>
                <li><code>RATE_LIMITED</code>: AI provider rate limit hit.</li>
                <li><code>GENERATION_FAILED</code>: AI returned a malformed response.</li>
            </ul>
        </DocsLayout>
    );
}
