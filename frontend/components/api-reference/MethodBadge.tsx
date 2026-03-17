import React from 'react';

interface MethodBadgeProps {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
}

const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
    const styles = {
        GET: 'bg-[#22c55e] text-black',
        POST: 'bg-[#3b82f6] text-white',
        PATCH: 'bg-[#f59e0b] text-black',
        DELETE: 'bg-[#ef4444] text-white',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${styles[method]}`}>
            {method}
        </span>
    );
};

export default MethodBadge;
