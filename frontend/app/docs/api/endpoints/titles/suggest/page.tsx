import React from 'react';
import EndpointDoc from '@/components/api-reference/EndpointDoc';
import EndpointPlayground from '@/components/api-reference/EndpointPlayground';
import ResponseSchema from '@/components/api-reference/ResponseSchema';
import { API_ENDPOINTS } from '@/lib/api-reference/endpoints';
import { CODE_EXAMPLES } from '@/lib/api-reference/examples';

export default function TitlesSuggestEndpointPage() {
    const endpoint = API_ENDPOINTS.find(e => e.id === 'titles-suggest')!;
    const examples = CODE_EXAMPLES['titles-suggest'] || { curl: '', typescript: '', python: '' };

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
                    <h2 className="text-xl font-bold text-[#f0f0f0] mb-6">Response Schema</h2>
                    <ResponseSchema fields={endpoint.responses[0].schema} />
                </section>
            </div>

            <div className="endpoint-playground">
                <EndpointPlayground
                    method={endpoint.method}
                    path={endpoint.path}
                    isStreaming={endpoint.streaming}
                    examples={examples}
                    initialBody={JSON.stringify({
                        topic: "Future of AI in Content Marketing",
                        llmProvider: "claude",
                        apiKey: "sk-ant-..."
                    }, null, 2)}
                />
            </div>
        </div>
    );
}
