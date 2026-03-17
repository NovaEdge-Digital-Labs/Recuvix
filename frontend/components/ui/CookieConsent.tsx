'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('recuvix_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('recuvix_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('recuvix_cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:w-[420px]"
                >
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#e8ff47]/10 flex items-center justify-center flex-shrink-0">
                                <Cookie size={20} className="text-[#e8ff47]" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-white font-bold text-sm">We use cookies</h3>
                                <p className="text-neutral-400 text-xs leading-5">
                                    Recuvix uses cookies to enhance your experience, analyze traffic, and for personalized content.
                                    By clicking "Accept", you agree to our use of cookies. Read our{' '}
                                    <Link href="/privacy" className="text-white underline hover:text-[#e8ff47]">Privacy Policy</Link>.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-neutral-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAccept}
                                className="flex-1 h-10 bg-[#e8ff47] text-black text-xs font-bold rounded-xl hover:bg-[#d4e840] transition-all"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleDecline}
                                className="flex-1 h-10 bg-white/5 text-white text-xs font-bold border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
