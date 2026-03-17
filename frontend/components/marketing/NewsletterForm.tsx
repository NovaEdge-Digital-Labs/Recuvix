"use client";
'use client';

import React, { useState } from 'react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
        }
    };

    return (
        <section className="py-24 px-[max(40px,5vw)] max-w-4xl mx-auto">
            <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#e8ff47]/5 blur-[100px] -mr-48 -mt-48 rounded-full" />

                <div className="relative z-10 text-center">
                    {!subscribed ? (
                        <>
                            <h2 className="font-bebas text-4xl md:text-6xl text-white mb-6">Join 3,200+ Readers</h2>
                            <p className="font-outfit text-zinc-500 mb-12 text-lg max-w-xl mx-auto">
                                Get our weekly breakdown of search algorithm updates, AI content prompts, and case studies from the Indian digital ecosystem.
                            </p>

                            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                                <input
                                    type="email"
                                    required
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-black border border-white/10 rounded-xl px-6 py-4 text-white font-outfit outline-none focus:border-[#e8ff47]/40 transition-colors text-lg"
                                />
                                <button
                                    type="submit"
                                    className="bg-[#e8ff47] text-black font-bebas text-2xl px-12 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-[0_10px_30px_rgba(232,255,71,0.2)]"
                                >
                                    SUBSCRIBE NOW
                                </button>
                            </form>

                            <div className="mt-8 flex items-center justify-center gap-6 group cursor-default">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0d0d0d] bg-zinc-800 grayscale" />
                                    ))}
                                </div>
                                <p className="text-zinc-600 text-sm font-mono uppercase tracking-widest">Trust by top SEO heads</p>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 animate-in fade-in zoom-in duration-500">
                            <div className="text-6xl mb-6">✅</div>
                            <h2 className="font-bebas text-5xl text-white mb-4">You're on the list!</h2>
                            <p className="font-outfit text-zinc-500 text-lg mb-8">
                                Welcome to the Insider. We've sent a confirmation email to <span className="text-[#e8ff47]">{email}</span>.
                            </p>
                            <div className="inline-flex flex-col gap-4">
                                <a href="/blog" className="text-[#e8ff47] font-bebas text-xl border-b border-[#e8ff47]/30 hover:border-[#e8ff47] transition-all pb-1">BROWSE RECENT GUIDES →</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <style jsx>{`
                .font-bebas { font-family: var(--font-bebas), sans-serif; }
                .font-outfit { font-family: var(--font-outfit), sans-serif; }
            `}</style>
        </section>
    );
}
