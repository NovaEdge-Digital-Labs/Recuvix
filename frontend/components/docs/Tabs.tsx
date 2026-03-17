'use client';

import React, { useState } from 'react';

interface TabsProps {
    items: string[];
    children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ items, children }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const childrenArray = React.Children.toArray(children);

    return (
        <div className="my-8">
            <div className="flex gap-2 p-1 mb-4 rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] w-fit">
                {items.map((item, index) => (
                    <button
                        key={item}
                        onClick={() => setActiveIndex(index)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeIndex === index
                                ? 'bg-[#e8ff47] text-black shadow-lg shadow-[#e8ff47]/10'
                                : 'text-[#666] hover:text-[#f0f0f0]'
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div>
                {childrenArray[activeIndex]}
            </div>
        </div>
    );
};

export default Tabs;
