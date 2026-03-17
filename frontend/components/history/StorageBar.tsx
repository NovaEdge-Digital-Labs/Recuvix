import React from 'react';

interface StorageBarProps {
    used: number; // in slots (0-50)
    total?: number;
}

export const StorageBar: React.FC<StorageBarProps> = ({ used, total = 50 }) => {
    const percentage = (used / total) * 100;

    let barColor = 'bg-green-500';
    if (percentage > 75) barColor = 'bg-red-500';
    else if (percentage > 50) barColor = 'bg-yellow-500';

    return (
        <div className="space-y-1 w-full">
            <div className="flex justify-between text-[11px] text-muted-foreground/80">
                <span>Storage Usage</span>
                <span>{used} / {total} slots</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} transition-all duration-500 ease-out`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                />
            </div>
        </div>
    );
};
