"use client";
import React from 'react';

interface WLPlanCardProps {
    name: string;
    price: string;
    users: string;
    workspaces: string;
    domain: string;
    revShare: string;
    features: string[];
    ctaLabel: string;
    featured?: boolean;
}

const WLPlanCard: React.FC<WLPlanCardProps> = ({
    name,
    price,
    users,
    workspaces,
    domain,
    revShare,
    features,
    ctaLabel,
    featured
}) => {
    return (
        <div className={`wl-plan-card ${featured ? 'featured' : ''}`}>
            <div className="wl-plan-inner">
                {featured && <div className="featured-badge">RECOMMENDED</div>}

                <div className="plan-header">
                    <h4 className="plan-label">{name}</h4>
                    <div className="plan-price">
                        {price}
                        <span className="price-period">/month</span>
                    </div>
                </div>

                <ul className="plan-stats">
                    <li><strong>{users}</strong> users</li>
                    <li><strong>{workspaces}</strong> workspaces</li>
                    <li>{domain}</li>
                    <li><strong>{revShare}</strong> revenue share</li>
                </ul>

                <ul className="plan-features">
                    {features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>

                <button className={`plan-cta ${featured ? 'primary' : 'secondary'}`}>
                    {ctaLabel}
                </button>
            </div>

            <style jsx>{`
        .wl-plan-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 40px 32px;
          position: relative;
          transition: all 250ms;
          flex: 1;
        }

        .wl-plan-card.featured {
          border-color: rgba(232, 255, 71, 0.2);
          background: rgba(232, 255, 71, 0.02);
          transform: scale(1.05);
          z-index: 10;
        }

        .featured-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #e8ff47;
          color: #000;
          font-family: var(--font-bebas), sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
          padding: 4px 12px;
          border-radius: 100px;
        }

        .plan-header {
          margin-bottom: 32px;
        }

        .plan-label {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
        }

        .wl-plan-card.featured .plan-label {
          color: #e8ff47;
        }

        .plan-price {
          font-family: var(--font-bebas), sans-serif;
          font-size: 40px;
          color: #f0f0f0;
          line-height: 1;
        }

        .price-period {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #444;
          margin-left: 4px;
        }

        .plan-stats {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 24px;
        }

        .plan-stats li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #888;
          margin-bottom: 8px;
        }

        .plan-stats strong {
          color: #f0f0f0;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 40px;
        }

        .plan-features li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          color: #555;
          margin-bottom: 12px;
          padding-left: 20px;
          position: relative;
        }

        .plan-features li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #e8ff47;
        }

        .plan-cta {
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          font-family: var(--font-bebas), sans-serif;
          font-size: 18px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 200ms;
        }

        .plan-cta.primary {
          background: #e8ff47;
          border: none;
          color: #000;
        }

        .plan-cta.secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f0f0f0;
        }

        .plan-cta.secondary:hover {
          border-color: rgba(232, 255, 71, 0.5);
          color: #e8ff47;
        }

        @media (max-width: 1024px) {
          .wl-plan-card.featured {
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default WLPlanCard;
