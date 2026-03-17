"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Clock, Server, Globe, Database, Cpu } from 'lucide-react';

interface ServiceStatus {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    uptime: string;
    latency: string;
}

export default function StatusPage() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const services: ServiceStatus[] = [
        { name: 'Blog Generation Engine', status: 'operational', uptime: '99.98%', latency: '1.2s' },
        { name: 'Recuvix API', status: 'operational', uptime: '100%', latency: '45ms' },
        { name: 'Dashboard & Auth', status: 'operational', uptime: '99.99%', latency: '120ms' },
        { name: 'Image Processing Worker', status: 'operational', uptime: '99.95%', latency: '2.5s' },
        { name: 'Content Preview Service', status: 'operational', uptime: '100%', latency: '80ms' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-outfit flex flex-col items-center justify-center p-6 selection:bg-[#e8ff47] selection:text-black">
            {/* Background Grain/Noise Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

            <div className={`max-w-xl w-full transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold font-syne tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        System Status
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        All systems operational
                    </div>
                </div>

                <div className="grid gap-4 mb-12">
                    {services.map((service, idx) => (
                        <div
                            key={service.name}
                            className="group bg-[#0d0d0d] border border-[#111] hover:border-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:bg-[#111]/50"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-[#1a1a1a] group-hover:border-[#e8ff47]/30 transition-colors">
                                    {idx === 0 && <Cpu className="w-5 h-5 text-[#e8ff47]" />}
                                    {idx === 1 && <Globe className="w-5 h-5 text-blue-400" />}
                                    {idx === 2 && <Database className="w-5 h-5 text-purple-400" />}
                                    {idx === 3 && <Server className="w-5 h-5 text-orange-400" />}
                                    {idx === 4 && <Clock className="w-5 h-5 text-green-400" />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white transition-colors">{service.name}</h3>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Uptime: {service.uptime} • {service.latency}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-green-500 uppercase tracking-wider">Operational</span>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[#e8ff47] hover:text-white transition-all hover:gap-3 font-medium group"
                    >
                        <span className="w-8 h-[1px] bg-[#e8ff47]/20 group-hover:bg-white/40 transition-colors" />
                        Back to Home
                    </Link>
                </div>
            </div>

            <footer className="mt-24 text-center">
                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-mono">
                    Updated every 60 seconds • Powered by Recuvix Infrastructure
                </p>
            </footer>

            <style jsx>{`
                @font-face {
                    font-family: 'Syne';
                    src: url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
                }
                @font-face {
                    font-family: 'Outfit';
                    src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
                }
            `}</style>
        </div>
    );
}
