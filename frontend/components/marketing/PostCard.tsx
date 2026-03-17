"use client";
import React from 'react';
import { getOptimizedImageUrl } from '@/lib/utils/cloudinary';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
}

const PostCard: React.FC<PostCardProps> = ({
  slug,
  title,
  excerpt,
  coverImage,
  category,
  authorName,
  authorAvatar,
  publishedAt,
  readTime
}) => {
  return (
    <a href={`/blog/${slug}`} className="post-card">
      <div className="post-cover">
        <img src={getOptimizedImageUrl(coverImage, 600, 400)} alt={title} />
        <span className="post-category">
          {category.replace('_', ' ')}
        </span>
      </div>
      <div className="post-body">
        <h3 className="post-title">{title}</h3>
        <p className="post-excerpt">{excerpt}</p>
        <div className="post-meta">
          <img className="author-avatar" src={getOptimizedImageUrl(authorAvatar, 64, 64)} alt={authorName} />
          <div className="meta-text">
            <span className="author-name">{authorName}</span>
            <div className="meta-sub">
              <span className="post-date">{publishedAt}</span>
              <span className="divider">·</span>
              <span className="read-time">{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .post-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 250ms, border-color 250ms;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }

        .post-card:hover {
          transform: translateY(-4px);
          border-color: rgba(232, 255, 71, 0.2);
        }

        .post-cover {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .post-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 400ms;
        }

        .post-card:hover .post-cover img {
          transform: scale(1.05);
        }

        .post-category {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(5, 5, 5, 0.8);
          border: 1px solid rgba(232, 255, 71, 0.3);
          color: #e8ff47;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 100px;
          backdrop-filter: blur(8px);
        }

        .post-body {
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .post-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .post-excerpt {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 24px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-meta {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .meta-text {
          display: flex;
          flex-direction: column;
        }

        .author-name {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #d0d0d0;
        }

        .meta-sub {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: #444;
          text-transform: uppercase;
        }

        .divider {
          opacity: 0.5;
        }
      `}</style>
    </a>
  );
};

export default PostCard;
