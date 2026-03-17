"use client";
import React from 'react';

interface StepCardProps {
    number: string;
    icon: string | React.ReactNode;
    title: string;
    body: string;
    checklist: string[];
    visual: React.ReactNode;
    reversed?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
    number,
    icon,
    title,
    body,
    checklist,
    visual,
    reversed
}) => {
    return (
        <section className="step-section">
            <div className={`step-container ${reversed ? 'reversed' : ''}`}>
                <div className="step-content">
                    <div className="step-watermark">{number}</div>
                    <div className="step-icon">
                        <div className="icon-circle">{icon}</div>
                    </div>
                    <h2 className="step-title">{title}</h2>
                    <p className="step-body-text">{body}</p>
                    <ul className="step-checklist">
                        {checklist.map((item, idx) => (
                            <li key={idx}>
                                <span className="bullet">→</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="step-visual">
                    <div className="visual-wrapper">
                        {visual}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .step-section {
          padding: 100px max(40px, 5vw);
          position: relative;
          overflow: hidden;
        }

        .step-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 80px;
        }

        .step-container.reversed {
          flex-direction: row-reverse;
        }

        .step-content {
          flex: 1;
          position: relative;
        }

        .step-watermark {
          position: absolute;
          top: -40px;
          left: -20px;
          font-family: var(--font-bebas), sans-serif;
          font-size: 200px;
          line-height: 1;
          color: white;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
          color: transparent;
        }

        .step-icon {
          position: relative;
          z-index: 1;
          margin-bottom: 24px;
        }

        .icon-circle {
          width: 56px;
          height: 56px;
          background: rgba(232, 255, 71, 0.1);
          border: 1px solid rgba(232, 255, 71, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #e8ff47;
        }

        .step-title {
          position: relative;
          z-index: 1;
          font-family: var(--font-bebas), sans-serif;
          font-size: 48px;
          color: #f0f0f0;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }

        .step-body-text {
          position: relative;
          z-index: 1;
          font-family: var(--font-outfit), sans-serif;
          font-size: 17px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .step-checklist {
          position: relative;
          z-index: 1;
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step-checklist li {
          font-family: var(--font-outfit), sans-serif;
          font-size: 15px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bullet {
          color: #e8ff47;
          font-family: var(--font-mono), monospace;
          font-weight: bold;
        }

        .step-visual {
          flex: 1.2;
          position: relative;
          z-index: 1;
        }

        .visual-wrapper {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
        }

        @media (max-width: 1024px) {
          .step-container {
            flex-direction: column !important;
            gap: 60px;
            text-align: center;
          }

          .step-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .step-watermark {
            left: 50%;
            transform: translateX(-50%);
          }

          .step-body-text {
            margin-left: auto;
            margin-right: auto;
          }

          .step-checklist {
            align-items: flex-start;
            margin: 0 auto;
          }
        }
      `}</style>
        </section>
    );
};

export default StepCard;
