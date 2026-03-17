import React from 'react';

interface TabProps {
    children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ children }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
        </div>
    );
};

export default Tab;
