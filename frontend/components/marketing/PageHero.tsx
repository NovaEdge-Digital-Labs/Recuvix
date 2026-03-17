"use client";
import React from 'react';
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  cta?: {
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
  badge?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  label,
  title,
  titleAccent,
  subtitle,
  cta,
  badge
}) => {
  // Split title if titleAccent is provided
  let titleBefore = title;
  let titleAfter = "";

  if (titleAccent && title.includes(titleAccent)) {
    const parts = title.split(titleAccent);
    titleBefore = parts[0];
    titleAfter = parts.slice(1).join(titleAccent);
  }

  return (
    <section className="page-hero">
      {/* Subtle grid overlay */}
      <div className="hero-grid-bg" />

      {/* Accent orb */}
      <div className="hero-orb" />

      <div className="page-hero-inner">
        <span className="page-hero-label">
          {label}
        </span>
        <h1 className="page-hero-title">
          {titleBefore}
          {titleAccent && (
            <span className="text-accent">
              {titleAccent}
            </span>
          )}
          {titleAfter}
        </h1>
        <p className="page-hero-subtitle">
          {subtitle}
        </p>
        {cta && (
          <div className="page-hero-cta flex gap-4">
            <a href={cta.primary.href} className="btn-primary">
              {cta.primary.label}
            </a>
            {cta.secondary && (
              <a href={cta.secondary.href} className="btn-secondary">
                {cta.secondary.label}
              </a>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-hero {
          padding: 140px max(40px, 5vw) 100px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          background: #050505;
        }

        .hero-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(232, 255, 71, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 255, 71, 0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .hero-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(232, 255, 71, 0.07), transparent 70%);
          top: -200px;
          right: -100px;
          pointer-events: none;
          filter: blur(40px);
        }

        .page-hero-inner {
          position: relative;
          z-index: 10;
          max-width: 800px;
        }

        .page-hero-label {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #e8ff47;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 20px;
        }

        .page-hero-title {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(56px, 8vw, 110px);
          line-height: 0.95;
          margin-bottom: 24px;
          color: #f0f0f0;
          text-transform: uppercase;
        }

        .page-hero-subtitle {
          font-family: var(--font-outfit), sans-serif;
          font-size: 17px;
          color: #666;
          max-width: 520px;
          line-height: 1.75;
          margin-bottom: 36px;
        }

        .text-accent { 
          color: #e8ff47; 
        }
      `}</style>
    </section>
  );
};

export default PageHero;
