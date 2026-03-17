import React from 'react';
import { Metadata } from 'next';
import PageHero from '@/components/marketing/PageHero';
import BlogFilters from '@/components/marketing/BlogFilters';
import PostCard from '@/components/marketing/PostCard';
import FeaturedPost from '@/components/marketing/FeaturedPost';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { getBlogPosts } from '@/lib/marketing/data';

export const metadata: Metadata = {
    title: 'Blog — AI SEO & Content Strategy',
    description: 'Expert guides, tutorials, and strategies for leveraging AI in SEO and content marketing. Learn how to rank higher and write faster with Recuvix.',
};

export default async function BlogIndexPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;
    const activeCategory = category || 'all';
    const posts = await getBlogPosts();

    const categories = ['tutorials', 'seo_tips', 'product_updates', 'case_studies', 'guides'];

    const filteredPosts = activeCategory === 'all'
        ? posts
        : posts.filter(p => p.category === activeCategory);

    const featuredPost = posts.find(p => p.is_featured);

    return (
        <main className="min-h-screen bg-[#050505]">
            <LandingNav />

            <PageHero
                label="INSIGHTS"
                title="SEO, AI, AND"
                titleAccent="CONTENT."
                subtitle="Guides, tutorials, and strategies for content creators and digital agencies."
            />

            <section className="blog-section py-20 px-[max(40px,5vw)]">
                {/* We'll keep BlogFilters as a Client Component but handle selection via URL/Link */}
                <BlogFilters
                    categories={categories}
                    activeCategory={activeCategory}
                />

                {activeCategory === 'all' && featuredPost && (
                    <FeaturedPost
                        slug={featuredPost.slug}
                        title={featuredPost.title}
                        excerpt={featuredPost.excerpt}
                        coverImage={featuredPost.cover_image_url || ''}
                        category={featuredPost.category}
                        authorName={featuredPost.author_name}
                        publishedAt={new Date(featuredPost.published_at).toLocaleDateString()}
                        readTime={featuredPost.read_time_minutes}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto mt-12">
                    {filteredPosts.filter(p => activeCategory !== 'all' || !p.is_featured).map(post => (
                        <PostCard
                            key={post.id}
                            slug={post.slug}
                            title={post.title}
                            excerpt={post.excerpt}
                            coverImage={post.cover_image_url || ''}
                            category={post.category}
                            authorName={post.author_name}
                            authorAvatar={post.author_avatar_url || ''}
                            publishedAt={new Date(post.published_at).toLocaleDateString()}
                            readTime={post.read_time_minutes}
                        />
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-40">
                        <p className="text-zinc-600 font-outfit">No posts found in this category.</p>
                    </div>
                )}
            </section>

            {/* Newsletter Strip */}
            <section className="py-24 bg-zinc-950 border-y border-white/5">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div>
                        <h2 className="font-bebas text-4xl text-white mb-2">Get SEO tips in your inbox</h2>
                        <p className="text-zinc-500 text-sm font-outfit">No spam. Just actionable content strategy every Tuesday.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-black border border-white/10 rounded-lg px-6 py-4 flex-1 md:w-80 text-white font-outfit outline-none focus:border-[#e8ff47]/40 transition-colors"
                        />
                        <button className="bg-[#e8ff47] text-black font-bebas text-lg px-8 rounded-lg">SUBSCRIBE</button>
                    </div>
                </div>
            </section>

            <LandingFooter />

        </main>
    );
}
