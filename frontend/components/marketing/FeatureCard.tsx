"use client";
import React from 'react';

interface FeatureCardProps {
    icon: string | React.ReactNode;
    title: string;
    subtitle?: string;
    description: string;
    visual?: React.ReactNode;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    rowSpan?: 1 | 2;
    badges?: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    subtitle,
    description,
    visual,
    colSpan = 4,
    rowSpan = 1,
    badges
}) => {
    return (
        <div
            className={`feature-card span-col-${colSpan} span-row-${rowSpan}`}
        >
            <div className="feature-card-content">
                <div className="feature-card-header">
                    <div className="feature-icon">
                        {typeof icon === 'string' ? icon : icon}
                    </div>
                    <div className="feature-title-group">
                        <h3 className="feature-card-title">{title}</h3>
                        {subtitle && <p className="feature-card-subtitle">{subtitle}</p>}
                    </div>
                </div>

                <p className="feature-card-description">{description}</p>

                {badges && (
                    <div className="feature-badges">
                        {badges.map((badge, idx) => (
                            <span key={idx} className="feature-badge">
                                {badge}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {visual && (
                <div className="feature-card-visual">
                    {visual}
                </div>
            )}

            <style jsx>{`
        .feature-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          transition: all 250ms;
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          border-color: rgba(232, 255, 71, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(232, 255, 71, 0.05);
        }

        .feature-card-content {
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .feature-card-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 20px;
        }

        .feature-icon {
          font-size: 32px;
          color: #e8ff47;
          line-height: 1;
        }

        .feature-card-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #f0f0f0;
          line-height: 1.2;
        }

        .feature-card-subtitle {
          font-size: 14px;
          color: #e8ff47;
          opacity: 0.8;
          margin-top: 4px;
        }

        .feature-card-description {
          font-family: var(--font-outfit), sans-serif;
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          max-width: 400px;
        }

        .feature-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 24px;
        }

        .feature-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #666;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .feature-card-visual {
          position: relative;
          z-index: 1;
          margin-top: auto;
        }

        /* 12-column grid spans */
        .span-col-12 { grid-column: span 12; }
        .span-col-8 { grid-column: span 8; }
        .span-col-4 { grid-column: span 4; }
        .span-row-2 { grid-row: span 2; }

        @media (max-width: 1024px) {
          .span-col-8, .span-col-4 {
            grid-column: span 12;
          }
        }
      `}</style>
        </div>
    );
};

export default FeatureCard;
