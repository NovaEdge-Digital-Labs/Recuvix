import DocsLayout from '@/components/docs/DocsLayout';
import Callout from '@/components/docs/Callout';
import Tabs from '@/components/docs/Tabs';
import Tab from '@/components/docs/Tab';
import StepList from '@/components/docs/StepList';
import Step from '@/components/docs/Step';

export default function ByokGuidePage() {
    return (
        <DocsLayout
            title="Using Your Own API Key (BYOK)"
            description="BYOK (Bring Your Own Key) mode lets you use Recuvix completely free by providing your own LLM API key. This is the preferred method for power users and developers."
        >
            <Callout type="tip">
                BYOK mode has no limits. Generate as many blogs as you want — you only pay your LLM provider directly (typically ₹2-5 per blog generation).
            </Callout>

            <section className="mt-12">
                <h2>Supported models & cost</h2>
                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#0d0d0d] border-b border-[#111]">
                            <tr>
                                <th className="px-4 py-3 font-mono text-[11px] text-[#444] uppercase tracking-wider">Model</th>
                                <th className="px-4 py-3 font-mono text-[11px] text-[#444] uppercase tracking-wider">Provider</th>
                                <th className="px-4 py-3 font-mono text-[11px] text-[#444] uppercase tracking-wider">Key Format</th>
                                <th className="px-4 py-3 font-mono text-[11px] text-[#444] uppercase tracking-wider">Est. Cost/Blog</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0d0d0d]">
                            <TableRow model="Claude 3.5 Sonnet" provider="Anthropic" format="sk-ant-..." cost="₹3-6" />
                            <TableRow model="GPT-4o" provider="OpenAI" format="sk-proj-..." cost="₹4-8" />
                            <TableRow model="Gemini 2.0 Flash" provider="Google" format="AIzaSy..." cost="₹1-3" />
                            <TableRow model="Grok 3" provider="xAI" format="xai-..." cost="₹3-5" />
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-12">
                <h2>Getting your API key</h2>
                <Tabs items={['Claude', 'ChatGPT', 'Gemini', 'Grok']}>
                    <Tab>
                        <StepList>
                            <Step number={1} title="Go to Anthropic Console">
                                Visit <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a> and sign in.
                            </Step>
                            <Step number={2} title="Create API key">
                                Navigate to <strong>Settings</strong> → <strong>API Keys</strong> and click <strong>Create Key</strong>.
                            </Step>
                            <Step number={3} title="Copy and paste">
                                Copy your <code>sk-ant-...</code> key and paste it into Recuvix Onboarding or Settings.
                            </Step>
                        </StepList>
                        <Callout type="warning">
                            Anthropic keys start with <code>sk-ant-api03-</code>. Keys beginning with <code>sk-ant-admin</code> are for administrative use and will not work for generation.
                        </Callout>
                    </Tab>
                    <Tab>
                        <StepList>
                            <Step number={1} title="Go to OpenAI Platform">
                                Visit <a href="https://platform.openai.com" target="_blank">platform.openai.com</a>.
                            </Step>
                            <Step number={2} title="Generate secret key">
                                Go to <strong>API Keys</strong> in the sidebar and create a new secret key.
                            </Step>
                            <Step number={3} title="Enable billing">
                                Ensure you have a credit balance in your OpenAI account, or generation will fail with a 429 error.
                            </Step>
                        </StepList>
                    </Tab>
                    <Tab>
                        <StepList>
                            <Step number={1} title="Go to Google AI Studio">
                                Visit <a href="https://aistudio.google.com" target="_blank">aistudio.google.com</a>.
                            </Step>
                            <Step number={2} title="Get API key">
                                Click <strong>Get API key</strong> in the sidebar.
                            </Step>
                            <Step number={3} title="Copy key">
                                Copy the <code>AIzaSy...</code> key and use it in Recuvix. Gemini Flash is often free or very low cost.
                            </Step>
                        </StepList>
                    </Tab>
                    <Tab>
                        <StepList>
                            <Step number={1} title="Go to xAI Console">
                                Visit <a href="https://console.x.ai" target="_blank">console.x.ai</a>.
                            </Step>
                            <Step number={2} title="Create Key">
                                Generate an API key and ensure your account has credits.
                            </Step>
                        </StepList>
                    </Tab>
                </Tabs>
            </section>

            <section className="mt-12">
                <h2>Privacy guarantee</h2>
                <p>We take your API key security seriously. Here is how we handle it:</p>
                <ul className="space-y-3 mt-4">
                    <li className="flex items-start gap-3 text-sm text-[#999]">
                        <span className="text-[#e8ff47]">✓</span>
                        <span>Stored <strong>only</strong> in your browser's localStorage.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-[#999]">
                        <span className="text-[#e8ff47]">✓</span>
                        <span>Sent directly to the AI provider from your browser via our proxy (for CORS).</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-[#999]">
                        <span className="text-red-500">✗</span>
                        <span><strong>Never</strong> transmitted to or stored on Recuvix servers.</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-[#999]">
                        <span className="text-red-500">✗</span>
                        <span><strong>Never</strong> logged in any form on our backend.</span>
                    </li>
                </ul>
            </section>
        </DocsLayout>
    );
}

function TableRow({ model, provider, format, cost }: { model: string, provider: string, format: string, cost: string }) {
    return (
        <tr className="hover:bg-white/[0.02]">
            <td className="px-4 py-4 font-medium text-[#f0f0f0]">{model}</td>
            <td className="px-4 py-4 text-[#999]">{provider}</td>
            <td className="px-4 py-4 font-mono text-xs text-[#666]">{format}</td>
            <td className="px-4 py-4 text-[#e8ff47]">{cost}</td>
        </tr>
    );
}
