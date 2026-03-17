'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const DocsBreadcrumbs = () => {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <nav className="flex items-center gap-2 mb-8 text-[13px]">
            <Link
                href="/docs"
                className="text-[#666] hover:text-[#999] transition-colors"
            >
                <Home className="w-3.5 h-3.5" />
            </Link>

            {paths.map((path, index) => {
                const href = `/${paths.slice(0, index + 1).join('/')}`;
                const isLast = index === paths.length - 1;
                const label = path
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                return (
                    <React.Fragment key={path}>
                        <ChevronRight className="w-3 h-3 text-[#333]" />
                        {isLast ? (
                            <span className="text-[#999] font-medium">{label}</span>
                        ) : (
                            <Link
                                href={href}
                                className="text-[#666] hover:text-[#999] transition-colors"
                            >
                                {label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default DocsBreadcrumbs;
