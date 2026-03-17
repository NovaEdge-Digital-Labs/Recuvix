"use client";
'use client';

import React, { useState, useEffect } from 'react';

const RevenueCalculator: React.FC = () => {
  const [clients, setClients] = useState(50);
  const [creditsPerClient, setCreditsPerClient] = useState(20);
  const [markup, setMarkup] = useState(30);

  const PLATFORM_PRICE_PER_CREDIT = 40; // Base platform price in INR
  const LICENCE_COST = 4999;
  const REV_SHARE_PERCENT = 15;

  const [results, setResults] = useState({
    totalCredits: 0,
    grossRevenue: 0,
    platformCost: 0,
    earnings: 0,
    netProfit: 0,
    roi: 0
  });

  useEffect(() => {
    const credits = clients * creditsPerClient;
    const grossRevenue = credits * (PLATFORM_PRICE_PER_CREDIT * (1 + markup / 100));
    const platformCost = credits * PLATFORM_PRICE_PER_CREDIT;
    const revenueShare = grossRevenue * (REV_SHARE_PERCENT / 100);
    const earnings = revenueShare;
    const netProfit = earnings - LICENCE_COST;
    const roi = netProfit > 0 ? (LICENCE_COST / netProfit).toFixed(1) : 0;

    setResults({
      totalCredits: credits,
      grossRevenue: Math.round(grossRevenue),
      platformCost: Math.round(platformCost),
      earnings: Math.round(earnings),
      netProfit: Math.round(netProfit),
      roi: Number(roi)
    });
  }, [clients, creditsPerClient, markup]);

  return (
    <section className="calc-section">
      <div className="calc-inner">
        <h2 className="calc-heading">Calculate your revenue potential</h2>
        <p className="calc-subheading">Drag the sliders to see your projected monthly earnings.</p>

        <div className="calc-grid">
          {/* Sliders */}
          <div className="calc-inputs">
            <div className="input-group">
              <div className="label-row">
                <label>Number of clients</label>
                <span className="value">{clients}</span>
              </div>
              <input type="range" min="10" max="500" value={clients} onChange={(e) => setClients(parseInt(e.target.value))} />
            </div>

            <div className="input-group">
              <div className="label-row">
                <label>Blogs per client / mo</label>
                <span className="value">{creditsPerClient}</span>
              </div>
              <input type="range" min="5" max="50" value={creditsPerClient} onChange={(e) => setCreditsPerClient(parseInt(e.target.value))} />
            </div>

            <div className="input-group">
              <div className="label-row">
                <label>Your markup (%)</label>
                <span className="value">{markup}%</span>
              </div>
              <input type="range" min="10" max="100" value={markup} onChange={(e) => setMarkup(parseInt(e.target.value))} />
            </div>
          </div>

          {/* Results Card */}
          <div className="calc-results">
            <div className="result-row">
              <span className="res-label">Total blogs sold/mo</span>
              <span className="res-value font-mono">{results.totalCredits}</span>
            </div>
            <div className="result-row">
              <span className="res-label">Gross Revenue</span>
              <span className="res-value">₹{results.grossRevenue.toLocaleString()}</span>
            </div>
            <div className="result-row">
              <span className="res-label">Platform Cost</span>
              <span className="res-value">₹{results.platformCost.toLocaleString()}</span>
            </div>
            <div className="result-row accent">
              <span className="res-label">Your Earnings</span>
              <span className="res-value">₹{results.earnings.toLocaleString()}</span>
            </div>

            <div className="net-profit-box">
              <span className="profit-label">NET PROFIT</span>
              <span className="profit-value">₹{results.netProfit.toLocaleString()}</span>
              {results.netProfit > 0 && (
                <span className="roi-label">ROI: {results.roi} months to break even</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .calc-section {
          padding: 100px max(40px, 5vw);
          background: #0d0d0d;
          border-radius: 20px;
          margin: 60px max(40px, 5vw);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .calc-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .calc-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 8px;
        }

        .calc-subheading {
          font-family: var(--font-outfit), sans-serif;
          font-size: 16px;
          color: #666;
          text-align: center;
          margin-bottom: 60px;
        }

        .calc-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .calc-inputs {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .label-row label {
          font-family: var(--font-outfit), sans-serif;
          font-size: 15px;
          color: #888;
        }

        .label-row .value {
          font-family: var(--font-mono), monospace;
          font-size: 14px;
          color: #e8ff47;
          background: rgba(232, 255, 71, 0.1);
          padding: 4px 12px;
          border-radius: 100px;
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: #1a1a1a;
          border-radius: 100px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e8ff47;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(232, 255, 71, 0.3);
        }

        .calc-results {
          background: #050505;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #555;
        }

        .result-row.accent {
          color: #e8ff47;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .res-value {
          color: #f0f0f0;
          font-weight: 600;
        }

        .net-profit-box {
          margin-top: 12px;
          background: rgba(232, 255, 71, 0.05);
          border: 1px solid rgba(232, 255, 71, 0.1);
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .profit-label {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          color: #888;
          letter-spacing: 0.15em;
        }

        .profit-value {
          font-family: var(--font-bebas), sans-serif;
          font-size: 48px;
          color: #e8ff47;
          line-height: 1;
        }

        .roi-label {
          font-size: 12px;
          color: #555;
          margin-top: 4px;
        }

        @media (max-width: 900px) {
          .calc-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default RevenueCalculator;
