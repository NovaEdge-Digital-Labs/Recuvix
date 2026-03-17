"use client";
import React from 'react';

interface PricingCardProps {
    credits: number;
    label: string;
    price: string;
    perBlog: string;
    savings?: string;
    features: string[];
    ctaLabel: string;
    popular?: boolean;
    note?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
    credits,
    label,
    price,
    perBlog,
    savings,
    features,
    ctaLabel,
    popular,
    note = "One-time payment · Credits never expire"
}) => {
    return (
        <div className={`pricing-card ${popular ? 'popular' : ''}`}>
            <div className="pricing-card-inner">
                {popular && (
                    <div className="popular-badge">
                        MOST POPULAR
                    </div>
                )}

                <div className="pricing-credits">
                    <span className="credits-number">{credits}</span>
                    <span className="credits-label">{label}</span>
                </div>

                <div className="pricing-amount">
                    <span className="currency">₹</span>
                    <span className="amount">{price}</span>
                </div>

                <div className="per-blog">
                    {perBlog}
                </div>

                {savings && (
                    <div className="savings-badge">
                        {savings}
                    </div>
                )}

                <ul className="pricing-features">
                    {features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                    ))}
                </ul>

                <button className="pricing-cta">
                    {ctaLabel}
                </button>

                <p className="pricing-note">
                    {note}
                </p>
            </div>

            <style jsx>{`
        .pricing-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 32px 28px;
          position: relative;
          transition: transform 250ms, box-shadow 250ms, border-color 250ms;
          flex: 1;
          min-width: 280px;
        }

        .pricing-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }

        .pricing-card.popular {
          border-color: rgba(232, 255, 71, 0.35);
          box-shadow: 0 0 60px rgba(232, 255, 71, 0.07);
        }

        .popular-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: #e8ff47;
          color: #000;
          font-family: var(--font-bebas), sans-serif;
          font-size: 12px;
          letter-spacing: 0.15em;
          padding: 4px 16px;
          border-radius: 100px;
          white-space: nowrap;
        }

        .credits-number {
          font-family: var(--font-bebas), sans-serif;
          font-size: 72px;
          line-height: 1;
          color: #e8ff47;
        }

        .credits-label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 18px;
          color: #555;
          margin-left: 8px;
          vertical-align: middle;
        }

        .pricing-amount {
          margin-top: 16px;
          margin-bottom: 4px;
        }

        .currency {
          font-size: 24px;
          color: #999;
          vertical-align: top;
          margin-top: 8px;
          display: inline-block;
        }

        .amount {
          font-family: var(--font-bebas), sans-serif;
          font-size: 56px;
          color: #f0f0f0;
        }

        .per-blog {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          color: #555;
          margin-bottom: 12px;
        }

        .savings-badge {
          display: inline-block;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #22c55e;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          border-radius: 100px;
          margin-bottom: 24px;
        }

        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 0 0 28px;
        }

        .pricing-features li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #777;
          padding: 6px 0;
          padding-left: 20px;
          position: relative;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .pricing-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #e8ff47;
          font-size: 12px;
        }

        .pricing-cta {
          width: 100%;
          padding: 14px;
          background: #e8ff47;
          color: #000;
          font-family: var(--font-bebas), sans-serif;
          font-size: 16px;
          letter-spacing: 0.1em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 200ms;
        }

        .pricing-cta:hover { opacity: 0.85; }

        .pricing-note {
          text-align: center;
          font-size: 11px;
          color: #333;
          margin-top: 12px;
          font-family: var(--font-mono), monospace;
        }
      `}</style>
        </div>
    );
};

export default PricingCard;
