import React from 'react';

interface StepListProps {
    children: React.ReactNode;
}

const StepList: React.FC<StepListProps> = ({ children }) => {
    return (
        <div className="flex flex-col gap-8 my-8 ml-4 border-l border-[#111]">
            {children}
        </div>
    );
};

export default StepList;
