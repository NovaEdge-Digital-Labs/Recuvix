"use client";
import React from 'react';
import { getOptimizedImageUrl } from '@/lib/utils/cloudinary';

interface FeaturedPostProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({
  slug,
  title,
  excerpt,
  coverImage,
  category,
  authorName,
  publishedAt,
  readTime
}) => {
  return (
    <section className="featured-post-section">
      <a href={`/blog/${slug}`} className="featured-card">
        <div className="featured-content">
          <span className="featured-badge">Featured Post</span>
          <span className="featured-category">{category.replace('_', ' ')}</span>
          <h2 className="featured-title">{title}</h2>
          <p className="featured-excerpt">{excerpt}</p>
          <div className="featured-meta">
            <span className="author">{authorName}</span>
            <span className="divider">·</span>
            <span className="date">{publishedAt}</span>
            <span className="divider">·</span>
            <span className="time">{readTime} min read</span>
          </div>
          <div className="read-more">Read Article →</div>
        </div>

        <div className="featured-image">
          <img src={getOptimizedImageUrl(coverImage, 1000, 600)} alt={title} />
        </div>
      </a>

      <style jsx>{`
        .featured-post-section {
          padding: 60px max(40px, 5vw);
          max-width: 1400px;
          margin: 0 auto;
        }

        .featured-card {
          display: flex;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          overflow: hidden;
          min-height: 480px;
          text-decoration: none;
          transition: border-color 250ms, transform 250ms;
        }

        .featured-card:hover {
          border-color: rgba(232, 255, 71, 0.2);
          transform: translateY(-2px);
        }

        .featured-content {
          flex: 1;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .featured-badge {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: #e8ff47;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 24px;
          display: block;
        }

        .featured-category {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #555;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: block;
        }

        .featured-title {
          font-family: var(--font-syne), sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700;
          color: #f0f0f0;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .featured-excerpt {
          font-family: var(--font-outfit), sans-serif;
          font-size: 17px;
          color: #666;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 32px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .featured-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #444;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        .divider {
          opacity: 0.3;
        }

        .read-more {
          font-family: var(--font-bebas), sans-serif;
          font-size: 18px;
          color: #e8ff47;
          letter-spacing: 0.05em;
        }

        .featured-image {
          flex: 1.2;
          position: relative;
          overflow: hidden;
        }

        .featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 600ms;
        }

        .featured-card:hover .featured-image img {
          transform: scale(1.05);
        }

        @media (max-width: 1024px) {
          .featured-card {
            flex-direction: column-reverse;
            min-height: auto;
          }
          .featured-content {
            padding: 40px;
          }
          .featured-image {
            height: 300px;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedPost;
