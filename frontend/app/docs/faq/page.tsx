'use client';

import React, { useState } from 'react';
import DocsLayout from '@/components/docs/DocsLayout';
import { ChevronDown } from 'lucide-react';

const FAQ_DATA = [
    {
        category: "General",
        questions: [
            {
                q: "Is Recuvix free to use?",
                a: "Yes. BYOK (Bring Your Own Key) mode is completely free — you only pay your AI provider directly. Credits are only needed for Managed Mode where Recuvix provides the AI key."
            },
            {
                q: "What AI models does Recuvix support?",
                a: "We currently support Claude (Anthropic), ChatGPT (OpenAI), Gemini (Google), and Grok (xAI)."
            },
            {
                q: "Will Google penalize AI-written content?",
                a: "Recuvix generates humanized content that reads naturally. Google's policies target low-quality, unhelpful content regardless of how it was made. Our blogs follow E-E-A-T guidelines and include no keyword stuffing."
            }
        ]
    },
    {
        category: "Credits & Billing",
        questions: [
            {
                q: "What is 1 credit?",
                a: "One complete blog generation including the blog post, SEO meta pack, thumbnail, and images."
            },
            {
                q: "Do credits expire?",
                a: "No. Credits purchased never expire."
            },
            {
                q: "What happens if generation fails?",
                a: "Credits are automatically refunded within seconds. No support ticket needed."
            },
            {
                q: "What payment methods are accepted?",
                a: "All major Indian cards, UPI, net banking via Razorpay. International cards are also accepted."
            }
        ]
    },
    {
        category: "Technical",
        questions: [
            {
                q: "Where is my API key stored?",
                a: "Only in your browser's localStorage. It is never sent to or stored on Recuvix servers."
            },
            {
                q: "Which WordPress version is required for publishing?",
                a: "WordPress 5.6 or higher. No plugins needed. Uses WordPress Application Passwords (built-in)."
            },
            {
                q: "What audio formats does Voice to Blog support?",
                a: "MP3, WAV, M4A, OGG, FLAC, WebM, MP4. Maximum file size: 100MB."
            },
            {
                q: "Can I use Recuvix for non-English blogs?",
                a: "Yes. 12 languages are supported including Hindi, Spanish, French, German, Portuguese, Arabic, Japanese, Chinese, Korean, Italian, and Russian."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <DocsLayout
            title="Frequently Asked Questions"
            description="Common questions about Recuvix features, billing, and technical integration."
        >
            <div className="space-y-12">
                {FAQ_DATA.map((section) => (
                    <section key={section.category}>
                        <h2 className="!border-none !mb-6">{section.category}</h2>
                        <div className="space-y-4">
                            {section.questions.map((faq, idx) => (
                                <AccordionItem key={idx} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </DocsLayout>
    );
}

function AccordionItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`rounded-xl border transition-all duration-300 ${isOpen ? 'bg-[#0d0d0d] border-[#222]' : 'bg-transparent border-[#111] hover:border-[#1a1a1a]'
            }`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className={`text-sm font-medium transition-colors ${isOpen ? 'text-[#e8ff47]' : 'text-[#f0f0f0]'}`}>
                    {question}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#444] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#e8ff47]' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                <div className="p-5 pt-0 text-sm text-[#666] leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
