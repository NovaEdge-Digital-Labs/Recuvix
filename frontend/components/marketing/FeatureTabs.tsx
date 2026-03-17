"use client";
'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface FeatureTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

const FeatureTabs: React.FC<FeatureTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="feature-tabs-container">
      <div className="feature-tabs-pills">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .feature-tabs-container {
          display: flex;
          justify-content: center;
          margin-bottom: 60px;
          padding: 0 max(20px, 4vw);
        }

        .feature-tabs-pills {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.03);
          padding: 6px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
          justify-content: center;
        }

        .tab-pill {
          padding: 10px 24px;
          border-radius: 100px;
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 250ms;
        }

        .tab-pill:hover {
          color: #888;
        }

        .tab-pill.active {
          background: #e8ff47;
          color: #000;
        }

        @media (max-width: 640px) {
          .tab-pill {
            padding: 8px 16px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default FeatureTabs;
