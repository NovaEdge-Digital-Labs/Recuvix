'use client';

import React from 'react';
import DocsNavBar from './DocsNavBar';
import DocsSidebar from './DocsSidebar';
import DocsTableOfContents from './DocsTableOfContents';
import DocsBreadcrumbs from './DocsBreadcrumbs';
import DocsFooterNav from './DocsFooterNav';
import DocSearch from './DocSearch';

interface DocsLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href: string }[];
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="docs-root font-outfit">
      <DocsNavBar />
      <DocSearch />

      <div className="docs-body">
        <DocsSidebar />

        <main className="docs-main">
          <DocsBreadcrumbs />

          <div className="docs-header mb-12">
            <h1 className="text-4xl font-bold text-[#f0f0f0] mb-4 font-syne tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-[#999] leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          <div className="docs-content prose prose-invert max-w-none">
            {children}
          </div>

          <DocsFooterNav />
        </main>

        <DocsTableOfContents />
      </div>

      <style jsx global>{`
        .docs-root {
          min-height: 100vh;
          background: #050505;
          color: #f0f0f0;
        }

        .docs-body {
          display: flex;
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 64px;
        }

        .docs-sidebar {
          width: 260px;
          min-width: 260px;
          height: calc(100vh - 64px);
          overflow-y: auto;
          position: sticky;
          top: 64px;
          padding: 32px 0;
          border-right: 1px solid #111;
        }

        .docs-main {
          flex: 1;
          padding: 48px 40px;
          max-width: 720px;
          min-width: 0;
        }

        .docs-content h2 {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #f0f0f0;
          margin-top: 48px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #111;
        }

        .docs-content h3 {
          font-size: 18px;
          font-weight: 600;
          color: #d0d0d0;
          margin-top: 32px;
          margin-bottom: 16px;
        }

        .docs-content p {
          font-size: 15px;
          line-height: 1.8;
          color: #999;
          margin-bottom: 20px;
        }

        .docs-content a {
          color: #e8ff47;
          text-decoration: none;
          font-weight: 500;
        }
        .docs-content a:hover {
          text-decoration: underline;
        }

        .docs-content code:not(pre code) {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          padding: 2px 6px;
          border-radius: 4px;
          color: #e8ff47;
        }

        .docs-footer-nav {
          display: flex;
          justify-content: space-between;
          margin-top: 64px;
          padding-top: 32px;
          border-top: 1px solid #111;
          gap: 24px;
        }

        .docs-nav-card {
          background: #0d0d0d;
          border: 1px solid #111;
          border-radius: 12px;
          padding: 20px;
          min-width: 200px;
          transition: all 200ms;
        }
        .docs-nav-card:hover {
          border-color: #e8ff47;
          background: #e8ff47/[0.02];
          transform: translateY(-2px);
        }
        .docs-nav-card .nav-label {
          font-size: 10px;
          color: #444;
          font-family: 'JetBrains Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }
        .docs-nav-card .nav-title {
          font-size: 15px;
          color: #f0f0f0;
          font-weight: 600;
        }

        /* Custom scrollbar for sidebar */
        .docs-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .docs-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .docs-sidebar::-webkit-scrollbar-thumb {
          background: #111;
          border-radius: 20px;
        }
        .docs-sidebar:hover::-webkit-scrollbar-thumb {
          background: #222;
        }
      `}</style>
    </div>
  );
};

export default DocsLayout;
