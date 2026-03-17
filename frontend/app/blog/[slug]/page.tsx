import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { getBlogPostBySlug, getBlogPosts, BlogPost } from '@/lib/marketing/data';
import { getOptimizedImageUrl } from '@/lib/utils/cloudinary';

interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) return { title: 'Post Not Found | Recuvix' };

    return {
        title: `${post.title} | Recuvix Blog`,
        description: post.excerpt,
        alternates: {
            canonical: `https://recuvix.in/blog/${slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [getOptimizedImageUrl(post.cover_image_url || '', 1200, 630)],
            type: 'article',
            publishedTime: post.published_at,
            authors: [post.author_name],
            section: post.category,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [getOptimizedImageUrl(post.cover_image_url || '', 1200, 600)],
        }
    };
}

export default async function BlogPostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) notFound();

    // Fetch related posts (simple version: same category, excluding current)
    const allPosts = await getBlogPosts();
    const relatedPosts = allPosts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: getOptimizedImageUrl(post.cover_image_url || '', 1200, 675),
        datePublished: post.published_at,
        dateModified: post.published_at,
        author: {
            '@type': 'Person',
            name: post.author_name,
            url: 'https://recuvix.in',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Recuvix',
            logo: {
                '@type': 'ImageObject',
                url: 'https://recuvix.in/logo.png',
            },
        },
        description: post.excerpt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://recuvix.in/blog/${slug}`,
        },
    };

    return (
        <main className="min-h-screen bg-[#050505] text-[#f0f0f0]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <LandingNav />

            {/* Reading Progress Bar (Client Component would be needed for dynamic progress, 
          but we can keep it simple or just a styled line for now) */}
            <div className="fixed top-0 left-0 w-full h-[2px] z-[100]">
                <div className="h-full bg-[#e8ff47] transition-all duration-300" style={{ width: '30%' }} />
            </div>

            <article className="pt-32 pb-24 px-[max(20px,5vw)] max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
                {/* Left Sidebar (Desktop) - Reusing some of the previous styles */}
                <aside className="hidden lg:block w-64 sticky top-40 h-fit space-y-12">
                    <div>
                        <h4 className="font-bebas text-xl mb-6 tracking-wide underline decoration-[#e8ff47]/30 text-white">More from Recuvix</h4>
                        <div className="space-y-6">
                            {relatedPosts.map(rel => (
                                <a key={rel.id} href={`/blog/${rel.slug}`} className="group block">
                                    <div className="aspect-video rounded-xl bg-zinc-900 border border-white/5 overflow-hidden mb-3">
                                        <img src={getOptimizedImageUrl(rel.cover_image_url || '', 400, 225)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h5 className="font-outfit font-bold text-sm text-zinc-400 group-hover:text-white transition-colors line-clamp-2">
                                        {rel.title}
                                    </h5>
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 max-w-[720px] mx-auto">
                    <header className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1 bg-[#e8ff47]/10 border border-[#e8ff47]/30 text-[#e8ff47] font-mono text-[10px] rounded-full uppercase tracking-wider">
                                {post.category}
                            </span>
                            <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                {new Date(post.published_at).toLocaleDateString()} • {post.read_time_minutes} min read
                            </span>
                        </div>

                        <h1 className="font-syne text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden grayscale">
                                {post.author_avatar_url && (
                                    <img src={getOptimizedImageUrl(post.author_avatar_url, 80, 80)} alt={post.author_name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="text-xs font-mono">
                                <div className="text-zinc-300">{post.author_name}</div>
                                <div className="text-zinc-600 uppercase mt-1">SEO Ops @ Recuvix</div>
                            </div>
                            <div className="ml-auto flex gap-3">
                                {['🐦', '💼', '🔗'].map((icon, i) => (
                                    <button key={i} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center grayscale hover:grayscale-0 transition-all">{icon}</button>
                                ))}
                            </div>
                        </div>

                        <div className="aspect-[16/9] bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
                            <img src={getOptimizedImageUrl(post.cover_image_url || '', 1200)} className="w-full h-full object-cover" alt={post.title} />
                        </div>
                    </header>

                    <div
                        className="article-body font-outfit text-zinc-400 leading-[1.9] text-[17px]
              prose prose-invert prose-zinc max-w-none 
              prose-headings:font-syne prose-headings:font-bold prose-headings:text-white
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pt-8 prose-h2:border-t prose-h2:border-white/5
              prose-p:mb-6
              prose-blockquote:border-l-2 prose-blockquote:border-[#e8ff47] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-white prose-blockquote:text-xl
              prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <footer className="mt-20 pt-12 border-t border-white/5">
                        <div className="p-8 bg-zinc-900/30 border border-white/5 rounded-2xl flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden grayscale">
                                {post.author_avatar_url && <img src={post.author_avatar_url} alt={post.author_name} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <h4 className="text-white font-syne font-bold mb-1">Published by {post.author_name}</h4>
                                <p className="text-sm text-zinc-500">The content science team at Recuvix, dedicated to mastering AI-powered SEO.</p>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* Right Sidebar (Desktop) */}
                <aside className="hidden xl:block w-64 sticky top-40 h-fit space-y-12">
                    <div className="p-6 bg-gradient-to-br from-[#e8ff47]/5 to-transparent border border-[#e8ff47]/10 rounded-2xl text-center">
                        <h4 className="font-bebas text-xl text-white mb-4">Generate your own blogs</h4>
                        <p className="text-xs text-zinc-500 mb-6 font-outfit">Rank higher with AI-powered SEO content built specifically for your niche.</p>
                        <a href="/signup" className="block w-full py-3 bg-[#e8ff47] text-black font-bebas rounded hover:opacity-90 transition-opacity">TRY FREE →</a>
                    </div>
                </aside>
            </article>

            <LandingFooter />

        </main>
    );
}
