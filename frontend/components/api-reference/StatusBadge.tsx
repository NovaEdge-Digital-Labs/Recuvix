import React from 'react';

interface StatusBadgeProps {
    status: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let colorClass = 'text-green-500 bg-green-500/10';
    if (status >= 400 && status < 500) colorClass = 'text-yellow-500 bg-yellow-500/10';
    if (status >= 500) colorClass = 'text-red-500 bg-red-500/10';

    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
