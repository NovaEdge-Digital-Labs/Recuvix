import React from 'react';

interface StepProps {
    number: number;
    title: string;
    children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, children }) => {
    return (
        <div className="relative pl-10">
            <div className="absolute left-[-17px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#e8ff47] text-black font-bold text-sm border-4 border-[#050505]">
                {number}
            </div>
            <div className="space-y-2">
                <h3 className="!mt-0 font-bold text-white">{title}</h3>
                <div className="text-sm leading-relaxed text-[#999]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Step;
