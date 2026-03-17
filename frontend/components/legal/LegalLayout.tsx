'use client'

import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';

interface LegalLayoutProps {
    label: string;
    title: string;
    subtitle: string;
    lastUpdated?: string;
    effectiveDate?: string;
    sections: { id: string; title: string }[];
    activeId: string;
    children: React.ReactNode;
}

export default function LegalLayout({
    label,
    title,
    subtitle,
    lastUpdated,
    effectiveDate,
    sections,
    activeId,
    children
}: LegalLayoutProps) {
    return (
        <div className="legal-root">
            <LandingNav />

            {/* Page hero — minimal, editorial */}
            <div className="legal-hero">
                <div className="legal-hero-inner relative z-10">
                    <span className="legal-label">
                        {label}
                    </span>
                    <h1 className="legal-title">{title}</h1>
                    <p className="legal-subtitle">{subtitle}</p>
                    {lastUpdated && (
                        <div className="legal-meta">
                            <span>Last updated: {lastUpdated}</span>
                            <span>•</span>
                            <span>Effective: {effectiveDate}</span>
                            <span>•</span>
                            <a href="/privacy.pdf" className="legal-download">
                                ↓ Download PDF
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Two-column: TOC left, content right */}
            <div className="legal-body relative z-10">
                <div className="legal-toc">
                    <div className="toc-sticky">
                        <p className="toc-label">ON THIS PAGE</p>
                        {sections.map(s => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className={`toc-item ${activeId === s.id ? 'active' : ''}`}
                            >
                                {s.title}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="legal-content">
                    {children}
                </div>
            </div>

            <LandingFooter />
        </div>
    );
}
