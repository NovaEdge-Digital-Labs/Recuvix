"use client";
import React from 'react';

interface ChangelogEntryProps {
    version: string;
    date: string;
    title: string;
    type: 'major' | 'minor' | 'patch';
    changes: {
        type: 'added' | 'fixed' | 'improved' | 'removed';
        text: string;
    }[];
    image?: string;
    isNew?: boolean;
}

const ChangelogEntry: React.FC<ChangelogEntryProps> = ({
    version,
    date,
    title,
    type,
    changes,
    image,
    isNew
}) => {
    return (
        <div className={`changelog-entry ${isNew ? 'is-new' : ''}`}>
            <div className="entry-line" />

            <div className="entry-marker">
                <div className="marker-dot" />
            </div>

            <div className="entry-content">
                <div className="entry-meta">
                    <span className={`version-pill type-${type}`}>v{version}</span>
                    <span className="entry-date">{date}</span>
                </div>

                <h3 className="entry-title">{title}</h3>

                {image && (
                    <div className="entry-image">
                        <img src={image} alt={title} />
                    </div>
                )}

                <div className="entry-changes">
                    {changes.map((change, idx) => (
                        <div key={idx} className="change-item">
                            <span className={`change-tag tag-${change.type}`}>{change.type}</span>
                            <span className="change-text">{change.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .changelog-entry {
          position: relative;
          padding-left: 60px;
          padding-bottom: 80px;
        }

        .entry-line {
          position: absolute;
          left: 11px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.04);
        }

        .changelog-entry:last-child .entry-line {
           display: none;
        }

        .entry-marker {
          position: absolute;
          left: 0;
          top: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .marker-dot {
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          border: 2px solid #050505;
          transition: all 400ms;
        }

        .is-new .marker-dot {
          background: #e8ff47;
          box-shadow: 0 0 15px rgba(232, 255, 71, 0.5);
          width: 10px;
          height: 10px;
        }

        .entry-content {
           background: #0d0d0d;
           border: 1px solid rgba(255, 255, 255, 0.05);
           border-radius: 16px;
           padding: 32px;
           transition: border-color 250ms;
        }

        .changelog-entry:hover .entry-content {
           border-color: rgba(232, 255, 71, 0.15);
        }

        .entry-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .version-pill {
          font-family: var(--font-mono), monospace;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .type-major { background: #e8ff47; color: #000; font-weight: bold; }
        .type-minor { background: #1a1a1a; color: #999; border: 1px solid rgba(255, 255, 255, 0.05); }
        .type-patch { background: transparent; color: #555; border: 1px solid rgba(255, 255, 255, 0.03); }

        .entry-date {
          font-family: var(--font-outfit), sans-serif;
          font-size: 13px;
          color: #444;
        }

        .entry-title {
          font-family: var(--font-syne), sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 24px;
        }

        .entry-image {
          margin-bottom: 32px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          max-height: 400px;
        }

        .entry-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .entry-changes {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .change-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .change-tag {
          font-family: var(--font-mono), monospace;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 2px 6px;
          border-radius: 4px;
          min-width: 70px;
          text-align: center;
        }

        .tag-added { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .tag-fixed { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .tag-improved { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .tag-removed { background: rgba(255, 255, 255, 0.05); color: #666; }

        .change-text {
          font-family: var(--font-outfit), sans-serif;
          font-size: 14px;
          color: #777;
          line-height: 1.5;
        }
      `}</style>
        </div>
    );
};

export default ChangelogEntry;
