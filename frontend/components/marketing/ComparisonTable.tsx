"use client";
import React from 'react';

const ComparisonTable: React.FC = () => {
    const rows = [
        { task: "Write 1500-word blog", manual: "4-6 hours", recuvix: "3 minutes" },
        { task: "SEO meta tags", manual: "30 mins (3 tools)", recuvix: "Included" },
        { task: "Thumbnail", manual: "45 mins (Canva)", recuvix: "Included" },
        { task: "Find images", manual: "20 mins", recuvix: "Included" },
        { task: "Keyword research", manual: "1 hour", recuvix: "Built-in" },
        { task: "Competitor analysis", manual: "2 hours", recuvix: "5 minutes" },
        { task: "WordPress publish", manual: "15 mins", recuvix: "1 click" },
        { task: "Repurpose to social", manual: "2 hours", recuvix: "2 minutes" },
    ];

    return (
        <section className="comparison-section">
            <div className="comparison-inner">
                <h2 className="comparison-heading">Recuvix vs Writing It Yourself</h2>

                <div className="table-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Manual</th>
                                <th>With Recuvix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.task}</td>
                                    <td>{row.manual}</td>
                                    <td className="highlight-column">{row.recuvix}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td>Total Phase</td>
                                <td>10+ Hours</td>
                                <td className="accent-total">{'<'} 10 Minutes</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .comparison-section {
          padding: 100px max(40px, 5vw);
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .comparison-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .comparison-heading {
          font-family: var(--font-syne), sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #f0f0f0;
          text-align: center;
          margin-bottom: 60px;
        }

        .table-wrapper {
          overflow-x: auto;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .comparison-table th {
          padding: 24px;
          color: #555;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .comparison-table td {
          padding: 20px 24px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 15px;
          color: #888;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        }

        .highlight-column {
          color: #f0f0f0 !important;
          font-weight: 500;
        }

        .total-row td {
          background: rgba(255, 255, 255, 0.02);
          padding: 32px 24px;
          font-weight: 700;
          color: #f0f0f0;
          border-bottom: none;
        }

        .accent-total {
          color: #e8ff47 !important;
          font-size: 18px;
        }

        @media (max-width: 640px) {
          .comparison-table th, .comparison-table td {
            padding: 16px;
            font-size: 13px;
          }
        }
      `}</style>
        </section>
    );
};

export default ComparisonTable;
