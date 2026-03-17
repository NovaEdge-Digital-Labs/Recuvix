'use client';

import React, { useEffect, useState } from 'react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

const DocsTableOfContents = () => {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const content = document.querySelector('.docs-content');
        if (!content) return;

        const headingElements = Array.from(content.querySelectorAll('h2, h3'));
        const items: TocItem[] = headingElements.map((el) => {
            const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
            if (!el.id) el.id = id;
            return {
                id,
                text: el.textContent || '',
                level: parseInt(el.tagName[1]),
            };
        });

        setHeadings(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0% -80% 0%' }
        );

        headingElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="hidden lg:block w-[220px] sticky top-24 self-start px-6">
            <h4 className="text-[11px] font-mono font-bold text-[#444] uppercase tracking-widest mb-4">
                ON THIS PAGE
            </h4>
            <nav className="space-y-3">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm transition-all hover:text-[#f0f0f0] ${activeId === heading.id ? 'text-[#e8ff47]' : 'text-[#666]'
                            } ${heading.level === 3 ? 'pl-4 text-[13px] font-normal' : 'font-medium'}`}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default DocsTableOfContents;
