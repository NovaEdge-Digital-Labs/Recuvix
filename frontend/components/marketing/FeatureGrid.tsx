"use client";
import React from 'react';

interface FeatureGridProps {
    children: React.ReactNode;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ children }) => {
    return (
        <div className="feature-grid">
            {children}

            <style jsx>{`
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 24px;
          grid-auto-flow: dense;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 max(20px, 4vw) 100px;
        }

        @media (max-width: 1024px) {
          .feature-grid {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
};

export default FeatureGrid;
