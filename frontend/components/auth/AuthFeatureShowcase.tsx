'use client';

import { useEffect, useRef } from 'react';
import { Cloud, BookOpen, Lock, Zap, TrendingUp, Star } from 'lucide-react';

const features = [
    {
        icon: Cloud,
        title: 'Cloud sync',
        description: 'Access your blogs from any device, instantly',
    },
    {
        icon: BookOpen,
        title: 'Unlimited history',
        description: 'Every blog you generate, saved & searchable',
    },
    {
        icon: Lock,
        title: 'Secure storage',
        description: 'API keys encrypted, your data stays private',
    },
    {
        icon: Zap,
        title: 'Full pipeline',
        description: 'Generate, track, and publish in one place',
    },
];

const stats = [
    { value: '50K+', label: 'Blogs generated' },
    { value: '98%', label: 'Uptime SLA' },
    { value: '4.9★', label: 'Avg. rating' },
];

export function AuthFeatureShowcase() {
    const orbRef1 = useRef<HTMLDivElement>(null);
    const orbRef2 = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frame: number;
        let t = 0;
        const animate = () => {
            t += 0.004;
            if (orbRef1.current) {
                orbRef1.current.style.transform = `translate(${Math.sin(t) * 18}px, ${Math.cos(t * 0.7) * 14}px)`;
            }
            if (orbRef2.current) {
                orbRef2.current.style.transform = `translate(${Math.cos(t * 1.2) * 22}px, ${Math.sin(t * 0.9) * 16}px)`;
            }
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="hidden lg:flex flex-col justify-center relative bg-[#080808] border-l border-white/[0.06] px-12 py-16 overflow-hidden">
            {/* Animated Orbs */}
            <div
                ref={orbRef1}
                className="absolute top-[-80px] right-[-60px] w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(232,255,71,0.07) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    transition: 'transform 0.1s linear',
                }}
            />
            <div
                ref={orbRef2}
                className="absolute bottom-[-60px] left-[-40px] w-[320px] h-[320px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                    transition: 'transform 0.1s linear',
                }}
            />

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(232,255,71,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,71,0.025) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="max-w-sm relative z-10">
                {/* Logo mark */}
                <div className="flex items-center gap-2.5 mb-12">
                    <div className="w-9 h-9 rounded-xl bg-[#e8ff47] flex items-center justify-center shadow-[0_0_20px_rgba(232,255,71,0.3)]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">Recuvix</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                    Your AI Blog Platform
                </h2>
                <p className="text-white/40 mb-10 text-sm leading-relaxed">
                    Everything you generate, saved forever. BYOK — bring your own AI keys and pay only for what you use.
                </p>

                {/* Feature list */}
                <div className="space-y-5 mb-10">
                    {features.map(({ icon: Icon, title, description }, i) => (
                        <div
                            key={title}
                            className="flex items-start gap-4"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#e8ff47]/10 border border-[#e8ff47]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Icon size={14} className="text-[#e8ff47]" />
                            </div>
                            <div>
                                <p className="font-semibold text-white/90 text-sm">{title}</p>
                                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-10">
                    {stats.map(({ value, label }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-center"
                        >
                            <div className="text-[#e8ff47] font-bold text-base leading-none mb-1">{value}</div>
                            <div className="text-white/30 text-[10px] leading-tight">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonial */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className="fill-[#e8ff47] text-[#e8ff47]" />
                        ))}
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed italic">
                        "Recuvix cut our content production time by 80%. The SEO scores are consistently excellent."
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e8ff47] to-[#00d4ff] flex-shrink-0" />
                        <div>
                            <p className="text-white/70 text-[11px] font-medium">Sarah K.</p>
                            <p className="text-white/30 text-[10px]">Head of Content @ TechFlow</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={12} className="text-[#e8ff47]" />
                        <p className="text-xs text-white/30">
                            Trusted by 2,000+ content creators worldwide
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
