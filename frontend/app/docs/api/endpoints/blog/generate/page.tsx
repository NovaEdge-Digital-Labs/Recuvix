import React from 'react';
import EndpointDoc from '@/components/api-reference/EndpointDoc';
import EndpointPlayground from '@/components/api-reference/EndpointPlayground';
import ParamTable from '@/components/docs/ParamTable';
import ResponseSchema from '@/components/api-reference/ResponseSchema';
import { API_ENDPOINTS } from '@/lib/api-reference/endpoints';
import { CODE_EXAMPLES } from '@/lib/api-reference/examples';

export default function BlogGenerateEndpointPage() {
    const endpoint = API_ENDPOINTS.find(e => e.id === 'blog-generate')!;
    const examples = CODE_EXAMPLES['blog-generate'];

    return (
        <div className="endpoint-page">
            <div className="endpoint-doc">
                <EndpointDoc
                    method={endpoint.method}
                    path={endpoint.path}
                    title={endpoint.title}
                    description={endpoint.description}
                    auth={endpoint.auth}
                    streaming={endpoint.streaming}
                    credits={endpoint.credits}
                />

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-6">Request Body</h2>
                    <ParamTable params={endpoint.requestBody!} />
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-6">Response Schema</h2>
                    <ResponseSchema fields={endpoint.responses[0].schema} />
                </section>

                <section className="mt-12">
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-6">Common Error Codes</h2>
                    <div className="space-y-4">
                        {endpoint.errors.map(err => (
                            <div key={err.code} className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono font-bold text-red-500">{err.code}</span>
                                    <span className="text-sm text-[#f0f0f0]">{err.message}</span>
                                </div>
                                <p className="text-xs text-[#666]"><strong>How to fix:</strong> {err.fix}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="endpoint-playground">
                <EndpointPlayground
                    method={endpoint.method}
                    path={endpoint.path}
                    isStreaming={endpoint.streaming}
                    examples={examples}
                    initialBody={JSON.stringify({
                        topic: "Web Design Trends 2026",
                        country: "India",
                        llmProvider: "claude",
                        apiKey: "sk-ant-...",
                        tone: "professional",
                        wordCount: 1500
                    }, null, 2)}
                />
            </div>
        </div>
    );
}
