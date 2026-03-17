'use client'

import React from 'react';

interface LegalCalloutProps {
    children: React.ReactNode;
}

export function LegalCallout({ children }: LegalCalloutProps) {
    return (
        <div className="legal-callout">
            {children}
        </div>
    );
}
