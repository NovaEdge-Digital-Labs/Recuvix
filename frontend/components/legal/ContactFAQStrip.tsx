import React from 'react';

const FAQS = [
    {
        q: "How fast will I get a reply?",
        a: "Under 4 hours on business days."
    },
    {
        q: "I was charged but got no credits.",
        a: "Email support@recuvix.in with your payment ID. We resolve in under 2 hours."
    },
    {
        q: "How do I delete my account?",
        a: "Settings → Account → Delete Account. Instant. No waiting."
    }
];

export function ContactFAQStrip() {
    return (
        <div className="mt-20">
            <p className="font-mono text-[11px] text-[#333] uppercase tracking-[0.15em] mb-8">Quick answers</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FAQS.map((faq, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-[#111] p-6 rounded-xl">
                        <h4 className="font-syne text-[#f0f0f0] text-[15px] font-semibold mb-2">Q: {faq.q}</h4>
                        <p className="text-[#666] text-[14px]">A: {faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
