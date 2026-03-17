'use client';
import React from 'react';
import ApiLayout from '@/components/api-reference/ApiLayout';

export default function ApiRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ApiLayout>
            {children}
        </ApiLayout>
    );
}
