'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CookieBanner() {
    const [consent, setConsent] = useState<string | null>(null);

    useEffect(() => {
        // Check localStorage for existing consent
        const storedConsent = localStorage.getItem('recuvix_cookie_consent');
        if (storedConsent) {
            setConsent(storedConsent);

            // If already accepted, initialize GA4
            if (storedConsent === 'accepted') {
                initializeGA4();
            }
        } else {
            setConsent('none');
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('recuvix_cookie_consent', 'accepted');
        setConsent('accepted');
        initializeGA4();
    };

    const handleReject = () => {
        localStorage.setItem('recuvix_cookie_consent', 'rejected');
        setConsent('rejected');
    };

    const initializeGA4 = () => {
        const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
        if (!gaId || typeof window === 'undefined') return;

        // Check if script already exists
        if (document.getElementById('ga4-script')) return;

        // Global site tag (gtag.js)
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script1.id = 'ga4-script';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_path: window.location.pathname,
      });
    `;
        document.head.appendChild(script2);
    };

    if (consent !== 'none') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed bottom-0 left-0 w-full z-[9999]"
            >
                <div
                    className="w-full bg-[#050505]/95 backdrop-blur-[20px] border-t border-white/5 px-6 py-4 md:px-[3vw]"
                    style={{
                        backgroundColor: 'rgba(5, 5, 5, 0.95)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                >
                    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 text-sm text-neutral-300 leading-relaxed text-center md:text-left">
                            <span className="mr-2">🍪</span>
                            We use cookies to keep you logged in and understand how you use Recuvix.
                            We don't sell your data or show ads.
                            <Link href="/privacy" className="ml-2 text-white hover:underline font-medium">
                                Privacy Policy
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 text-xs font-semibold text-neutral-300 uppercase tracking-wider border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                            >
                                Reject Non-Essential
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-4 py-2 text-xs font-semibold text-black uppercase tracking-wider bg-[#e8ff47] rounded-lg hover:shadow-[0_0_20px_rgba(232,255,71,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                                style={{
                                    backgroundColor: '#e8ff47',
                                }}
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
