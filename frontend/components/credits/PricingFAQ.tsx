"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "How do credits work?",
        answer: "One credit equals one full blog generation in Managed Mode. This includes topic research, image processing, SEO metadata, and the blog content itself. If you use BYOK (Bring Your Own Key) mode, you don't need credits."
    },
    {
        question: "Do credits expire?",
        answer: "No, credits purchased on Recuvix never expire. They stay in your account balance until you use them."
    },
    {
        question: "What is Managed Mode?",
        answer: "In Managed Mode, Recuvix provides the AI API keys (OpenAI, Claude, Gemini, etc.). We handle rate limits, model selection, and prompt optimization, so you just focus on the content."
    },
    {
        question: "Can I use both Credits and BYOK?",
        answer: "Yes! You can toggle between Managed Mode (using credits) and BYOK Mode (using your own keys) at any time from the generation form or your profile settings."
    },
    {
        question: "Do you offer refunds?",
        answer: "If a blog generation fails due to a technical error on our end, your credit is automatically refunded. For other refund requests, please contact our support team within 14 days of purchase."
    },
    {
        question: "Which LLM models are available in Managed Mode?",
        answer: "Managed Mode currently uses the latest flagship models: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, and Grok-2. We always optimize for the best quality/speed ratio."
    }
];

export function PricingFAQ() {
    return (
        <div className="max-w-3xl mx-auto mt-32 mb-24">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Frequently Asked Questions
                </h2>
                <p className="mt-4 text-lg text-zinc-400">
                    Everything you need to know about Recuvix credits and pricing.
                </p>
            </div>

            <Accordion className="w-full space-y-4">
                {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border border-zinc-900 rounded-xl px-4 bg-zinc-900/20 backdrop-blur-sm">
                        <AccordionTrigger className="text-left text-zinc-100 font-medium hover:no-underline hover:text-accent transition-colors">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400 leading-relaxed pb-4">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
