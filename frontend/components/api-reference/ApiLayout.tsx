'use client';

import React from 'react';
import DocsNavBar from '../docs/DocsNavBar';
import ApiSidebar from './ApiSidebar';
import DocSearch from '../docs/DocSearch';

interface ApiLayoutProps {
    children: React.ReactNode;
}

const ApiLayout: React.FC<ApiLayoutProps> = ({ children }) => {
    return (
        <div className="api-root font-outfit h-screen flex flex-col overflow-hidden">
            <DocsNavBar />
            <DocSearch />

            <div className="api-body flex-1 flex overflow-hidden pt-16">
                <ApiSidebar />
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
                    {children}
                </div>
            </div>

            <style jsx global>{`
        .api-root {
          background: #050505;
          color: #f0f0f0;
        }

        .api-body {
          height: calc(100vh - 64px);
        }

        .endpoint-page {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100%;
          border-bottom: 1px solid #111;
        }

        .endpoint-doc {
          padding: 64px 48px;
          border-right: 1px solid #111;
          max-width: 800px;
        }

        .endpoint-playground {
          background: #030303;
          padding: 64px 40px;
          position: sticky;
          top: 0;
          height: fit-content;
          min-height: 100%;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .endpoint-page {
            grid-template-columns: 1fr;
          }
          .endpoint-doc {
            border-right: none;
            border-bottom: 1px solid #111;
            max-width: none;
          }
          .endpoint-playground {
            position: static;
            height: auto;
          }
        }
      `}</style>
        </div>
    );
};

export default ApiLayout;
