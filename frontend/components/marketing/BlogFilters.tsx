"use client";

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface BlogFiltersProps {
  categories: string[];
  activeCategory: string;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  activeCategory,
}) => {
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <div className="blog-filters-container">
      <div className="filters-row">
        <Link
          href={`/blog?${createQueryString('category', 'all')}`}
          className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?${createQueryString('category', cat)}`}
            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat.replace('_', ' ')}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .blog-filters-container {
          margin-bottom: 48px;
          display: flex;
          justify-content: center;
        }

        .filters-row {
          display: flex;
          gap: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px;
          border-radius: 100px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .filters-row::-webkit-scrollbar {
          display: none;
        }

        .filter-pill {
          padding: 8px 20px;
          border-radius: 100px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 250ms;
          text-transform: capitalize;
          white-space: nowrap;
          text-decoration: none;
        }

        .filter-pill:hover {
          color: #888;
        }

        .filter-pill.active {
          background: #e8ff47;
          color: #000;
        }

        @media (max-width: 640px) {
          .blog-filters-container {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogFilters;
