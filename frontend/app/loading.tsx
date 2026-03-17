'use client';

import React from 'react';

const css = `
  @keyframes progress-slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
  }
  .animate-progress-slide {
    animation: progress-slide 1.5s infinite ease-in-out;
  }
`;

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[100]">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-[#e8ff47]/10 overflow-hidden z-[101]">
        <div className="h-full bg-[#e8ff47] animate-progress-slide" style={{ width: '40%' }} />
      </div>

      {/* Centered Logo */}
      <div className="animate-pulse">
        <h1 className="text-4xl md:text-6xl font-bold font-syne text-[#f0f0f0] tracking-tighter uppercase">
          RECUVIX
        </h1>
      </div>
    </div>
  );
}
