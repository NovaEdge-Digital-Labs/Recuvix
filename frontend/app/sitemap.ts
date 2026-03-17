import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recuvix.in';

    // Static pages
    const staticPages = [
        '',
        '/features',
        '/pricing',
        '/how-it-works',
        '/white-label',
        '/blog',
        '/changelog',
        '/docs',
        '/privacy',
        '/terms',
        '/contact',
    ].map((path) => ({
        url: baseUrl + path,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1.0 : 0.8,
    }));

    // Dynamic blog posts
    const { data: posts } = (await supabaseAdmin
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('is_published', true)) as { data: any[] | null };

    const blogPages = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Docs pages (Mocking common routes based on directory structure)
    const docsPages = [
        '/docs/quickstart',
        '/docs/concepts',
        '/docs/guides/blog-generation',
        '/docs/guides/byok',
        '/docs/guides/managed-mode',
        '/docs/api/overview',
        '/docs/faq',
    ].map((path) => ({
        url: baseUrl + path,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [...staticPages, ...blogPages, ...docsPages];
}
