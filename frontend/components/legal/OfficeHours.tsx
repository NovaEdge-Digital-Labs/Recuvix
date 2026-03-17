import React from 'react';

export function OfficeHours() {
    return (
        <div className="p-6 bg-[#0a0a0a] border border-[#111] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#e8ff47] shadow-[0_0_10px_#e8ff47]" />
                <span className="font-mono text-[11px] text-[#666] uppercase tracking-wider">Support hours</span>
            </div>
            <div className="space-y-4 font-outfit">
                <div className="flex justify-between items-center">
                    <span className="text-[#888]">Mon – Fri</span>
                    <span className="text-[#f0f0f0]">9:00 AM – 6:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#888]">Sat</span>
                    <span className="text-[#f0f0f0]">10:00 AM – 2:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#888]">Sun</span>
                    <span className="text-[#666]">Closed</span>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#111] text-[12px] text-[#555]">
                Public holidays: Delayed response (24 hrs)
            </div>
        </div>
    );
}
