"use client";

import { useState } from "react";

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number>(0);

    const faqs = [
        {
            q: "Does Recuvix work for Indian niches?",
            a: "Yes. Recuvix is built with India-first SEO in mind. Set your target country and we generate content with local keywords, INR pricing references, and culturally relevant examples."
        },
        {
            q: "Will Google penalize AI-written content?",
            a: "Genuine, helpful content ranks regardless of how it was produced. Recuvix generates humanized, non-robotic content with no keyword stuffing and no emojis — the way human experts write."
        },
        {
            q: "Can I use my own OpenAI or Claude key?",
            a: "Yes. BYOK (Bring Your Own Key) mode is completely free — you pay only your LLM provider's API cost, which is typically ₹2-5 per blog."
        },
        {
            q: "What happens if the generation fails?",
            a: "Credits are automatically refunded. Always. No support ticket needed."
        },
        {
            q: "Can I publish directly to WordPress?",
            a: "Yes. Connect your WordPress site with an Application Password (no plugin needed) and publish as draft or live with one click."
        },
        {
            q: "What is the White Label option?",
            a: "Agencies can run Recuvix under their own brand on their own domain. Their clients never see Recuvix. Plans start at ₹4,999/month."
        }
    ];

    return (
        <section className="py-32 bg-[#050505] border-b border-white/[0.06] overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row gap-16">

                <div className="md:w-1/3 shrink-0">
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#e8ff47] tracking-[0.3em] font-bold uppercase mb-4 block">
                        QUESTIONS
                    </span>
                    <h2 className="font-['Bebas_Neue'] text-6xl md:text-[100px] leading-[0.85] text-white m-0 tracking-tight">
                        Honest<br />answers.
                    </h2>
                </div>

                <div className="md:w-2/3 flex flex-col gap-2">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`border border-white/[0.06] rounded-lg overflow-hidden transition-all duration-300
                ${openIndex === i ? 'bg-[#111] border-l-2 border-l-[#e8ff47]' : 'bg-[#0a0a0a] hover:bg-[#111]'}
              `}
                        >
                            <button
                                onClick={() => setOpenIndex(i === openIndex ? -1 : i)}
                                className="w-full text-left p-6 flex items-center justify-between gap-4 font-['Outfit'] font-semibold text-lg text-white"
                            >
                                <span>{faq.q}</span>
                                <span className={`text-[#e8ff47] transition-transform duration-300 shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${openIndex === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-[#a0a0a0] font-['Outfit'] leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
