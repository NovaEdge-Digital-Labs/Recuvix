"use client";
import React from 'react';

const IncludedGrid: React.FC = () => {
    const items = [
        { icon: "📝", label: "Full Blog Post", desc: "1500+ words of high-quality, human-like content." },
        { icon: "🎯", label: "SEO Meta Pack", desc: "Optimized title, description, and target keywords." },
        { icon: "🔗", label: "SEO Slug", desc: "Search-friendly URL structure for every post." },
        { icon: "📊", label: "JSON-LD Schema", desc: "Valid Article schema for Google rich results." },
        { icon: "📱", label: "Open Graph Tags", desc: "Perfect previews for Facebook and LinkedIn." },
        { icon: "🐦", label: "Twitter Card Tags", desc: "Optimized tags for high X engagement." },
        { icon: "🌍", label: "Hreflang Tags", desc: "Correct regional targeting for global reach." },
        { icon: "🖼", label: "Relevant Images", desc: "3-5 high-quality stock images sourced automatically." },
        { icon: "🎨", label: "AI Thumbnail", desc: "Custom cinematic thumbnail designed by AI." },
        { icon: "📋", label: "FAQ Section", desc: "Built-in FAQs to capture more search real estate." },
        { icon: "📦", label: "Export Formats", desc: "Get your content in HTML, Markdown, and XML." },
        { icon: "⬇", label: "One-Click Download", desc: "Package everything in a single click." },
    ];

    return (
        <section className="included-section">
            <div className="included-inner">
                <h2 className="included-heading">What you get in every generation</h2>
                <p className="included-subheading">(Not some generations. Every single one.)</p>

                <div className="included-grid">
                    {items.map((item, idx) => (
                        <div key={idx} className="included-item">
                            <div className="item-icon">{item.icon}</div>
                            <h3 className="item-label">{item.label}</h3>
                            <p className="item-desc">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .included-section {
          padding: 120px max(40px, 5vw);
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .included-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .included-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 8px;
        }

        .included-subheading {
          font-family: var(--font-outfit), sans-serif;
          font-size: 16px;
          color: #555;
          text-align: center;
          margin-bottom: 80px;
        }

        .included-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .included-item {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 24px;
          transition: all 250ms;
        }

        .included-item:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(232, 255, 71, 0.2);
          box-shadow: 0 0 30px rgba(232, 255, 71, 0.03);
        }

        .item-icon {
          font-size: 24px;
          margin-bottom: 16px;
        }

        .item-label {
          font-family: var(--font-syne), sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #f0f0f0;
          margin-bottom: 8px;
        }

        .item-desc {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }
      `}</style>
        </section>
    );
};

export default IncludedGrid;
