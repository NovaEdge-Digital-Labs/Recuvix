"use client";
import React from 'react';

const ModeComparison: React.FC = () => {
    return (
        <section className="mode-section">
            <div className="mode-inner">
                <h2 className="mode-heading">Which mode is right for you?</h2>

                <div className="mode-grid">
                    {/* BYOK Mode */}
                    <div className="mode-card">
                        <div className="mode-badge">FREE — No credits needed</div>
                        <div className="mode-icon">🔑</div>
                        <h3 className="mode-title">BYOK Mode</h3>

                        <div className="mode-best-for">
                            <p className="best-for-label">BEST FOR:</p>
                            <ul>
                                <li>→ Developers and power users</li>
                                <li>→ Agencies with high volume</li>
                                <li>→ Users who want full cost control</li>
                            </ul>
                        </div>

                        <div className="mode-how-it-works">
                            <h4>How it works:</h4>
                            <p>Add your API key from Claude, ChatGPT, Gemini, or Grok. Recuvix calls the AI from your browser — your key never touches our servers. Pay your provider ~₹2-5 per blog.</p>
                        </div>

                        <div className="mode-limit">
                            <span className="limit-label">LIMITS:</span>
                            <span className="limit-value text-[#e8ff47]">None. Unlimited blogs.</span>
                        </div>
                    </div>

                    {/* Managed Mode */}
                    <div className="mode-card featured">
                        <div className="mode-badge featured">No API key needed</div>
                        <div className="mode-icon featured">⚡</div>
                        <h3 className="mode-title">Managed Mode</h3>

                        <div className="mode-best-for">
                            <p className="best-for-label">BEST FOR:</p>
                            <ul>
                                <li>→ Non-technical users</li>
                                <li>→ Quick start, no setup</li>
                                <li>→ Users who don't want API accounts</li>
                            </ul>
                        </div>

                        <div className="mode-how-it-works">
                            <h4>How it works:</h4>
                            <p>Buy credit packs. We provide the AI key. 1 credit = 1 blog. Credits never expire. Auto-refunded on failure.</p>
                        </div>

                        <div className="mode-limit">
                            <span className="limit-label">COST:</span>
                            <span className="limit-value text-[#e8ff47]">From ₹23.99/blog</span>
                        </div>
                    </div>
                </div>

                <div className="mode-cta">
                    <a href="/pricing" className="btn-primary">Compare Plans →</a>
                </div>
            </div>

            <style jsx>{`
        .mode-section {
          padding: 100px max(40px, 5vw);
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .mode-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .mode-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 60px;
        }

        .mode-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        .mode-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .mode-card.featured {
          border-color: rgba(232, 255, 71, 0.2);
          background: rgba(232, 255, 71, 0.02);
        }

        .mode-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: #555;
          padding: 4px 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 100px;
        }

        .mode-badge.featured {
          color: #e8ff47;
          border-color: rgba(232, 255, 71, 0.3);
          background: rgba(232, 255, 71, 0.1);
        }

        .mode-icon {
          font-size: 32px;
          margin-bottom: 24px;
        }

        .mode-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 32px;
        }

        .mode-best-for {
          margin-bottom: 32px;
        }

        .best-for-label {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #444;
          margin-bottom: 12px;
          letter-spacing: 0.1em;
        }

        .mode-best-for ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mode-best-for li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #888;
        }

        .mode-how-it-works {
          margin-bottom: 32px;
          flex: 1;
        }

        .mode-how-it-works h4 {
          font-family: var(--font-outfit), sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #d0d0d0;
          margin-bottom: 12px;
        }

        .mode-how-it-works p {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #666;
        }

        .mode-limit {
          display: flex;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .limit-label {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          color: #444;
        }

        .limit-value {
          font-family: var(--font-bebas), sans-serif;
          font-size: 18px;
          letter-spacing: 0.05em;
        }

        .mode-cta {
          text-align: center;
        }

        @media (max-width: 768px) {
          .mode-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </section>
    );
};

export default ModeComparison;
