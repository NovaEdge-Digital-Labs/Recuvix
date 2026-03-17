export interface NavItem {
    title: string;
    href: string;
    external?: boolean;
}

export interface NavGroup {
    group: string;
    items: NavItem[];
}

export const DOC_NAVIGATION: NavGroup[] = [
    {
        group: "Getting Started",
        items: [
            { title: "Overview", href: "/docs" },
            { title: "Quickstart", href: "/docs/quickstart" },
            { title: "Core Concepts", href: "/docs/concepts" },
        ]
    },
    {
        group: "Guides",
        items: [
            { title: "Blog Generation", href: "/docs/guides/blog-generation" },
            { title: "BYOK — Your Own Key", href: "/docs/guides/byok" },
            { title: "Managed Mode", href: "/docs/guides/managed-mode" },
            { title: "SEO Meta Pack", href: "/docs/guides/seo-meta" },
            { title: "Thumbnails", href: "/docs/guides/thumbnails" },
            { title: "Multilingual", href: "/docs/guides/multilingual" },
            { title: "Bulk Generation", href: "/docs/guides/bulk-generation" },
            { title: "Voice to Blog", href: "/docs/guides/voice-to-blog" },
            { title: "Competitor Analyser", href: "/docs/guides/competitor" },
            { title: "Blog Repurposing", href: "/docs/guides/repurposing" },
            { title: "Internal Linking", href: "/docs/guides/internal-linking" },
            { title: "Content Calendar", href: "/docs/guides/calendar" },
            { title: "WordPress Publish", href: "/docs/guides/wordpress" },
            { title: "GSC Tracker", href: "/docs/guides/tracker" },
        ]
    },
    {
        group: "Platform",
        items: [
            { title: "Team Workspaces", href: "/docs/guides/workspaces" },
            { title: "White Label", href: "/docs/guides/white-label" },
            { title: "Credits & Billing", href: "/docs/guides/billing" },
        ]
    },
    {
        group: "API Reference",
        items: [
            { title: "Overview", href: "/docs/api/overview" },
            { title: "Authentication", href: "/docs/api/authentication" },
            { title: "Endpoints", href: "/docs/api/endpoints" },
            { title: "Error Codes", href: "/docs/api/errors" },
            { title: "Rate Limits", href: "/docs/api/rate-limits" },
        ]
    },
    {
        group: "Resources",
        items: [
            { title: "FAQ", href: "/docs/faq" },
            { title: "Changelog", href: "/docs/changelog" },
            { title: "Status Page", href: "/status" },
            { title: "Privacy Policy", href: "/privacy" },
            { title: "Terms of Service", href: "/terms" },
            { title: "Contact Support", href: "/contact" },
        ]
    },
];

export function getAdjacentPages(currentPath: string) {
    const flat = DOC_NAVIGATION.flatMap(g => g.items);
    const idx = flat.findIndex(i => i.href === currentPath);
    return {
        prev: idx > 0 ? flat[idx - 1] : null,
        next: idx < flat.length - 1 ? flat[idx + 1] : null,
    };
}
