import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import StepList from '@/components/docs/StepList';
import Step from '@/components/docs/Step';

export default function ApiAuthenticationPage() {
    return (
        <div className="endpoint-page">
            <div className="endpoint-doc">
                <div className="space-y-4 mb-12">
                    <h1 className="text-4xl font-bold font-syne text-[#f0f0f0]">Authentication</h1>
                    <p className="text-[#999] leading-relaxed max-w-xl text-lg">
                        All Recuvix API requests require authentication via a JSON Web Token (JWT).
                    </p>
                </div>

                <section>
                    <h2>How it works</h2>
                    <p className="text-[#999] mb-6">
                        Recuvix uses Supabase Auth for identity management. Every request to a protected endpoint must include an <code>Authorization</code> header with your session's JWT.
                    </p>
                    <CodeBlock language="bash">
                        Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN
                    </CodeBlock>
                </section>

                <section className="mt-12">
                    <h2>Getting a token</h2>
                    <p className="text-[#999] mb-4">There are several ways to retrieve your JWT depending on your environment:</p>

                    <StepList>
                        <Step number={1} title="Client-side (Browser)">
                            <p className="mb-4">If you are calling the API from a browser where the user is already logged in, use the Supabase client:</p>
                            <CodeBlock language="typescript">
                                {`const { data: { session } } = await supabase.auth.getSession()
const jwt = session?.access_token`}
                            </CodeBlock>
                        </Step>
                        <Step number={2} title="Server-side (Node.js)">
                            <p className="mb-4">For server-to-server calls, you can exchange user credentials for a session or use a service role key if performing administrative tasks.</p>
                            <CodeBlock language="typescript">
                                {`const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'your-password',
})`}
                            </CodeBlock>
                        </Step>
                    </StepList>
                </section>

                <Callout type="warning">
                    JWT tokens expire after 1 hour. Ensure your client handles token refreshing automatically via <code>supabase.auth.refreshSession()</code>.
                </Callout>

                <section className="mt-12">
                    <h2>API Keys (BYOK)</h2>
                    <p className="text-[#999] mb-4">
                        For generation-related endpoints, you must also provide your LLM API key in the request body. This is distinct from the Authorization header.
                    </p>
                    <CodeBlock language="json">
                        {`{
  "llmProvider": "claude",
  "apiKey": "sk-ant-...",
  "topic": "..."
}`}
                    </CodeBlock>
                </section>
            </div>

            <div className="endpoint-playground">
                <div className="sticky top-8 space-y-6">
                    <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#111]">
                        <h4 className="text-xs font-mono font-bold text-[#444] uppercase tracking-widest mb-4">Security Note</h4>
                        <p className="text-sm text-[#666] leading-relaxed">
                            Never expose your Supabase <strong>Service Role Key</strong> or your <strong>LLM API Keys</strong> on the client-side. Always use environment variables and server-side proxies for production applications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
